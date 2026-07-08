const questionRepository = require('../repositories/question.repository');
const answerRepository = require('../repositories/answer.repository');
const feedbackRepository = require('../repositories/feedback.repository');
const interviewRepository = require('../repositories/interview.repository');
const aiService = require('./ai.service');
const ApiError = require('../utils/ApiError');

const submitAnswer = async (userId, interviewId, payload) => {
  const { questionId, textAnswer, transcribedAnswer, codeAnswer, timeTakenSeconds } = payload;

  const question = await questionRepository.findById(questionId);
  if (!question || String(question.interview) !== String(interviewId)) {
    throw ApiError.notFound('Question not found for this interview.');
  }

  const answer = await answerRepository.create({
    question: questionId,
    interview: interviewId,
    user: userId,
    textAnswer: textAnswer || '',
    transcribedAnswer: transcribedAnswer || '',
    codeAnswer: codeAnswer || undefined,
    timeTakenSeconds: timeTakenSeconds || 0,
  });

  await questionRepository.markAnswered(questionId, answer._id);

  // Get AI feedback synchronously so the client can show per-question results
  const interview = await interviewRepository.findByIdRaw(interviewId);
  const evaluation = await aiService.evaluateAnswer({
    role: interview.role,
    experience: interview.experience,
    questionText: question.text,
    questionType: question.type,
    idealAnswerPoints: question.idealAnswerPoints,
    candidateAnswer: transcribedAnswer || textAnswer,
    codeAnswer,
    executionResult: codeAnswer?.executionResult,
  });

  const feedback = await feedbackRepository.create({
    answer: answer._id,
    question: questionId,
    interview: interviewId,
    user: userId,
    technicalScore: evaluation.technicalScore,
    communicationScore: evaluation.communicationScore,
    grammarScore: evaluation.grammarScore,
    confidenceScore: evaluation.confidenceScore,
    problemSolvingScore: evaluation.problemSolvingScore,
    overallScore: evaluation.overallScore,
    overallRating: evaluation.overallRating,
    strengths: evaluation.strengths,
    weaknesses: evaluation.weaknesses,
    suggestions: evaluation.suggestions,
    modelAnswer: evaluation.modelAnswer,
    rawAIResponse: evaluation,
  });

  await answerRepository.attachFeedback(answer._id, feedback._id);

  return { answer, feedback };
};

const getAggregateFeedbackForInterview = async (interviewId) => {
  const feedbacks = await feedbackRepository.findByInterview(interviewId);
  if (feedbacks.length === 0) {
    throw ApiError.badRequest('No answers have been submitted for this interview.');
  }

  const avg = (key) => feedbacks.reduce((sum, f) => sum + (f[key] || 0), 0) / feedbacks.length;

  const overallScore = Math.round(avg('overallScore'));
  const ratingFor = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Average';
    if (score >= 40) return 'Below Average';
    return 'Poor';
  };

  const allStrengths = feedbacks.flatMap((f) => f.strengths);
  const allWeaknesses = feedbacks.flatMap((f) => f.weaknesses);
  const allSuggestions = feedbacks.flatMap((f) => f.suggestions);

  return {
    technicalScore: Math.round(avg('technicalScore')),
    communicationScore: Math.round(avg('communicationScore')),
    grammarScore: Math.round(avg('grammarScore')),
    confidenceScore: Math.round(avg('confidenceScore')),
    problemSolvingScore: Math.round(avg('problemSolvingScore')),
    overallScore,
    overallRating: ratingFor(overallScore),
    strengths: [...new Set(allStrengths)].slice(0, 6),
    weaknesses: [...new Set(allWeaknesses)].slice(0, 6),
    suggestions: [...new Set(allSuggestions)].slice(0, 6),
  };
};

module.exports = { submitAnswer, getAggregateFeedbackForInterview };
