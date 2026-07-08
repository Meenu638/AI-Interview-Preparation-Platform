const interviewRepository = require('../repositories/interview.repository');
const questionRepository = require('../repositories/question.repository');
const resumeRepository = require('../repositories/resume.repository');
const userRepository = require('../repositories/user.repository');
const aiService = require('./ai.service');
const achievementService = require('./achievement.service');
const ApiError = require('../utils/ApiError');

const createInterview = async (userId, payload) => {
  const { role, company, experience, skills, difficulty, type, questionCount, useResume } = payload;

  let resumeContext = '';
  let sourceResume = null;
  if (useResume) {
    const resume = await resumeRepository.findLatestByUser(userId);
    if (resume) {
      resumeContext = resume.extractedText;
      sourceResume = resume._id;
    }
  }

  const interview = await interviewRepository.create({
    user: userId,
    role,
    company,
    experience,
    skills,
    difficulty,
    type,
    questionCount,
    sourceResume,
    status: 'pending',
  });

  const generatedQuestions = await aiService.generateInterviewQuestions({
    role,
    company,
    experience,
    skills,
    difficulty,
    type,
    questionCount,
    resumeContext,
  });

  const questionDocs = generatedQuestions.map((q, idx) => ({
    interview: interview._id,
    user: userId,
    order: q.order ?? idx + 1,
    text: q.text,
    type: q.type || type,
    topic: q.topic || '',
    difficulty: q.difficulty || difficulty,
    codingMeta: q.codingMeta || undefined,
    idealAnswerPoints: q.idealAnswerPoints || [],
  }));

  const savedQuestions = await questionRepository.insertMany(questionDocs);
  interview.questions = savedQuestions.map((q) => q._id);
  await interview.save();

  return interviewRepository.findById(interview._id);
};

const startInterview = async (userId, interviewId) => {
  const interview = await interviewRepository.findByIdRaw(interviewId);
  if (!interview || String(interview.user) !== String(userId)) {
    throw ApiError.notFound('Interview not found.');
  }
  interview.status = 'in-progress';
  interview.startedAt = new Date();
  await interview.save();
  return interview;
};

const getInterviewById = async (userId, interviewId) => {
  const interview = await interviewRepository.findById(interviewId);
  if (!interview || String(interview.user) !== String(userId)) {
    throw ApiError.notFound('Interview not found.');
  }
  return interview;
};

const listInterviews = async (userId, options) => {
  const [items, total] = await Promise.all([
    interviewRepository.findByUser(userId, options),
    interviewRepository.countByUser(userId, options.status ? { status: options.status } : {}),
  ]);
  return { items, total, page: options.page || 1, limit: options.limit || 10 };
};

const completeInterview = async (userId, interviewId, aggregateFeedback) => {
  const interview = await interviewRepository.findByIdRaw(interviewId);
  if (!interview || String(interview.user) !== String(userId)) {
    throw ApiError.notFound('Interview not found.');
  }

  interview.status = 'completed';
  interview.completedAt = new Date();
  interview.durationSeconds = Math.round((interview.completedAt - interview.startedAt) / 1000);
  interview.overallScore = aggregateFeedback.overallScore;
  interview.overallFeedback = aggregateFeedback;
  await interview.save();

  await userRepository.incrementStats(userId, {
    scoreDelta: aggregateFeedback.overallScore,
    questionCount: interview.questions.length,
  });

  await updateStreak(userId);
  await achievementService.evaluateAndUnlock(userId);

  return interview;
};

const updateStreak = async (userId) => {
  const user = await userRepository.findById(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last = user.streak.lastActiveDate ? new Date(user.streak.lastActiveDate) : null;
  if (last) last.setHours(0, 0, 0, 0);

  const oneDay = 24 * 60 * 60 * 1000;

  if (!last) {
    user.streak.current = 1;
  } else if (today - last === oneDay) {
    user.streak.current += 1;
  } else if (today - last > oneDay) {
    user.streak.current = 1;
  }
  // same day -> streak unchanged

  user.streak.longest = Math.max(user.streak.longest, user.streak.current);
  user.streak.lastActiveDate = today;
  await user.save({ validateBeforeSave: false });
};

const deleteInterview = async (userId, interviewId) => {
  const interview = await interviewRepository.findByIdRaw(interviewId);
  if (!interview || String(interview.user) !== String(userId)) {
    throw ApiError.notFound('Interview not found.');
  }
  await interviewRepository.deleteById(interviewId);
};

const toggleBookmark = async (userId, interviewId) => {
  const interview = await interviewRepository.findByIdRaw(interviewId);
  if (!interview || String(interview.user) !== String(userId)) {
    throw ApiError.notFound('Interview not found.');
  }
  interview.isBookmarked = !interview.isBookmarked;
  await interview.save();
  return interview;
};

module.exports = {
  createInterview,
  startInterview,
  getInterviewById,
  listInterviews,
  completeInterview,
  deleteInterview,
  toggleBookmark,
};
