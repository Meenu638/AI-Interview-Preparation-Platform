const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    originalName: { type: String, default: '' },
    extractedText: { type: String, default: '' },
    parsedData: {
      skills: [{ type: String }],
      experienceYears: { type: Number, default: 0 },
      projects: [{ type: String }],
      education: [{ type: String }],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
