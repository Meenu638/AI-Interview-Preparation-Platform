const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const resumeService = require('../services/resume.service');

const uploadResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.uploadResume(req.user._id, req.file);
  new ApiResponse(201, 'Resume uploaded and parsed.', { resume }).send(res);
});

const listResumes = asyncHandler(async (req, res) => {
  const resumes = await resumeService.listResumes(req.user._id);
  new ApiResponse(200, 'Resumes fetched.', { resumes }).send(res);
});

module.exports = { uploadResume, listResumes };
