const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const interviewService = require('../services/interview.service');
const answerService = require('../services/answer.service');

const createInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.createInterview(req.user._id, req.body);
  new ApiResponse(201, 'Interview generated successfully.', { interview }).send(res);
});

const startInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.startInterview(req.user._id, req.params.id);
  new ApiResponse(200, 'Interview started.', { interview }).send(res);
});

const getInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.getInterviewById(req.user._id, req.params.id);
  new ApiResponse(200, 'Interview fetched.', { interview }).send(res);
});

const listInterviews = asyncHandler(async (req, res) => {
  const { page, limit, status, search } = req.query;
  const result = await interviewService.listInterviews(req.user._id, {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    status,
    search,
  });
  new ApiResponse(200, 'Interviews fetched.', result).send(res);
});

const submitAnswer = asyncHandler(async (req, res) => {
  const result = await answerService.submitAnswer(req.user._id, req.params.id, req.body);
  new ApiResponse(201, 'Answer submitted and evaluated.', result).send(res);
});

const completeInterview = asyncHandler(async (req, res) => {
  const aggregateFeedback = await answerService.getAggregateFeedbackForInterview(req.params.id);
  const interview = await interviewService.completeInterview(req.user._id, req.params.id, aggregateFeedback);
  new ApiResponse(200, 'Interview completed.', { interview }).send(res);
});

const deleteInterview = asyncHandler(async (req, res) => {
  await interviewService.deleteInterview(req.user._id, req.params.id);
  new ApiResponse(200, 'Interview deleted.').send(res);
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const interview = await interviewService.toggleBookmark(req.user._id, req.params.id);
  new ApiResponse(200, 'Bookmark toggled.', { interview }).send(res);
});

const retakeInterview = asyncHandler(async (req, res) => {
  const original = await interviewService.getInterviewById(req.user._id, req.params.id);
  if (!original) throw ApiError.notFound('Original interview not found.');
  const interview = await interviewService.createInterview(req.user._id, {
    role: original.role,
    company: original.company,
    experience: original.experience,
    skills: original.skills,
    difficulty: original.difficulty,
    type: original.type,
    questionCount: original.questionCount,
  });
  new ApiResponse(201, 'Interview retake created.', { interview }).send(res);
});

module.exports = {
  createInterview,
  startInterview,
  getInterview,
  listInterviews,
  submitAnswer,
  completeInterview,
  deleteInterview,
  toggleBookmark,
  retakeInterview,
};
