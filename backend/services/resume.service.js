const pdfParse = require('pdf-parse');
const resumeRepository = require('../repositories/resume.repository');
const cloudinaryService = require('./cloudinary.service');
const aiService = require('./ai.service');
const ApiError = require('../utils/ApiError');

const uploadResume = async (userId, file) => {
  if (!file) throw ApiError.badRequest('Resume file is required.');

  const parsed = await pdfParse(file.buffer);
  const extractedText = parsed.text.trim();
  if (!extractedText) throw ApiError.badRequest('Could not extract text from the PDF.');

  const uploadResult = await cloudinaryService.uploadResumeBuffer(file.buffer, userId);

  let parsedData = { skills: [], experienceYears: 0, projects: [], education: [] };
  try {
    parsedData = await aiService.parseResumeText(extractedText);
  } catch (err) {
    // Non-fatal: resume is still stored even if AI parsing fails
    console.error('Resume AI parsing failed:', err.message);
  }

  // Deactivate previous resumes so only the latest is used for interview generation
  const previous = await resumeRepository.findByUser(userId);
  await Promise.all(previous.map((r) => resumeRepository.deactivate(r._id)));

  const resume = await resumeRepository.create({
    user: userId,
    fileUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    originalName: file.originalname,
    extractedText,
    parsedData,
  });

  return resume;
};

const listResumes = (userId) => resumeRepository.findByUser(userId);

module.exports = { uploadResume, listResumes };
