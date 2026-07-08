const Question = require('../models/Question');

const insertMany = (questions) => Question.insertMany(questions);

const findById = (id) => Question.findById(id);

const findByInterview = (interviewId) => Question.find({ interview: interviewId }).sort('order');

const updateById = (id, updates) =>
  Question.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

const markAnswered = (id, answerId) =>
  Question.findByIdAndUpdate(id, { answer: answerId, isAnswered: true }, { new: true });

const aggregateTopicScores = (userId) =>
  Question.aggregate([
    { $match: { user: userId, isAnswered: true } },
    {
      $lookup: {
        from: 'feedbacks',
        localField: '_id',
        foreignField: 'question',
        as: 'feedback',
      },
    },
    { $unwind: { path: '$feedback', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$topic',
        avgScore: { $avg: '$feedback.overallScore' },
        count: { $sum: 1 },
      },
    },
    { $sort: { avgScore: -1 } },
  ]);

module.exports = {
  insertMany,
  findById,
  findByInterview,
  updateById,
  markAnswered,
  aggregateTopicScores,
};
