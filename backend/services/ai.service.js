const { textModel } = require('../config/gemini');
const ApiError = require('../utils/ApiError');
const { buildQuestionGenerationPrompt } = require('../prompts/questionGeneration.prompt');
const { buildAnswerEvaluationPrompt } = require('../prompts/answerEvaluation.prompt');
const { buildResumeParsingPrompt } = require('../prompts/resumeParsing.prompt');

const safeParseJSON = (raw) => {
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    throw ApiError.internal('AI returned an unparsable response. Please retry.');
  }
};

const callGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw ApiError.internal('GEMINI_API_KEY is not configured on the server.');
  }
  try {
    const result = await textModel.generateContent(prompt);
    const text = result.response.text();
    return safeParseJSON(text);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw ApiError.internal(`AI generation failed: ${err.message}`);
  }
};

const generateInterviewQuestions = async (params) => {
  const prompt = buildQuestionGenerationPrompt(params);
  const data = await callGemini(prompt);
  if (!data.questions || !Array.isArray(data.questions)) {
    throw ApiError.internal('AI response missing questions array.');
  }
  return data.questions;
};

const evaluateAnswer = async (params) => {
  const prompt = buildAnswerEvaluationPrompt(params);
  return callGemini(prompt);
};

const parseResumeText = async (resumeText) => {
  const prompt = buildResumeParsingPrompt(resumeText);
  return callGemini(prompt);
};

module.exports = { generateInterviewQuestions, evaluateAnswer, parseResumeText };
