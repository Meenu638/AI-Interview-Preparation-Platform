const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    technicalScore: { type: Number, min: 0, max: 100, default: 0 },
    communicationScore: { type: Number, min: 0, max: 100, default: 0 },
    grammarScore: { type: Number, min: 0, max: 100, default: 0 },
    confidenceScore: { type: Number, min: 0, max: 100, default: 0 },
    problemSolvingScore: { type: Number, min: 0, max: 100, default: 0 },

    overallScore: { type: Number, min: 0, max: 100, default: 0 },
    overallRating: {
      type: String,
      enum: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'],
      default: 'Average',
    },

    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    modelAnswer: { type: String, default: '' },

    rawAIResponse: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
