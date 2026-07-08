const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    darkMode: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    dailyReminderTime: { type: String, default: '18:00' },
    preferredDifficulty: { type: String, enum: ['easy', 'medium', 'hard', 'adaptive'], default: 'adaptive' },
    preferredInterviewTypes: [{ type: String, enum: ['technical', 'hr', 'behavioral', 'coding', 'mixed'] }],
    language: { type: String, default: 'en' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
