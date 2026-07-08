const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: '' },
    experience: {
      type: String,
      enum: ['fresher', '0-1', '1-3', '3-5', '5-8', '8+'],
      required: true,
    },
    skills: [{ type: String, trim: true }],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    type: {
      type: String,
      enum: ['technical', 'hr', 'behavioral', 'coding', 'mixed'],
      required: true,
    },
    questionCount: { type: Number, required: true, min: 1, max: 50 },

    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'abandoned'],
      default: 'pending',
    },

    sourceResume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', default: null },

    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],

    startedAt: { type: Date },
    completedAt: { type: Date },
    durationSeconds: { type: Number, default: 0 },

    overallScore: { type: Number, min: 0, max: 100, default: null },
    overallFeedback: {
      technicalScore: { type: Number, default: null },
      communicationScore: { type: Number, default: null },
      grammarScore: { type: Number, default: null },
      confidenceScore: { type: Number, default: null },
      problemSolvingScore: { type: Number, default: null },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      suggestions: [{ type: String }],
      overallRating: { type: String, default: '' },
    },

    isBookmarked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ user: 1, status: 1 });
interviewSchema.index({ role: 'text', company: 'text' });

module.exports = mongoose.model('Interview', interviewSchema);
