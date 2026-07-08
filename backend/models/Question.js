const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    order: { type: Number, required: true },
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ['technical', 'hr', 'behavioral', 'coding'],
      required: true,
    },
    topic: { type: String, default: '' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },

    // For coding questions
    codingMeta: {
      language: { type: String, default: '' },
      starterCode: { type: String, default: '' },
      testCases: [
        {
          input: String,
          expectedOutput: String,
          isHidden: { type: Boolean, default: false },
        },
      ],
    },

    idealAnswerPoints: [{ type: String }],

    answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', default: null },
    isAnswered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

questionSchema.index({ interview: 1, order: 1 });

module.exports = mongoose.model('Question', questionSchema);
