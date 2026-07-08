const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    period: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },

    interviewsCompleted: { type: Number, default: 0 },
    questionsAnswered: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    topicScores: [
      {
        topic: { type: String },
        averageScore: { type: Number },
        count: { type: Number },
      },
    ],
    strongTopics: [{ type: String }],
    weakTopics: [{ type: String }],
  },
  { timestamps: true }
);

analyticsSchema.index({ user: 1, period: 1, periodStart: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
