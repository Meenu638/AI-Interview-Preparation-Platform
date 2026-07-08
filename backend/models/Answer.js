const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
    interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    textAnswer: { type: String, default: '' },
    transcribedAnswer: { type: String, default: '' }, // from speech-to-text
    codeAnswer: {
      language: { type: String, default: '' },
      code: { type: String, default: '' },
      executionResult: {
        passed: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        outputs: [{ input: String, output: String, expected: String, passed: Boolean }],
      },
    },

    timeTakenSeconds: { type: Number, default: 0 },

    feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Answer', answerSchema);
