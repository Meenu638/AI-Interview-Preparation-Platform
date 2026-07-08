const Feedback = require('../models/Feedback');

const create = (data) => Feedback.create(data);

const findByInterview = (interviewId) => Feedback.find({ interview: interviewId });

const aggregateAverages = (userId) =>
  Feedback.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        technicalScore: { $avg: '$technicalScore' },
        communicationScore: { $avg: '$communicationScore' },
        grammarScore: { $avg: '$grammarScore' },
        confidenceScore: { $avg: '$confidenceScore' },
        problemSolvingScore: { $avg: '$problemSolvingScore' },
        overallScore: { $avg: '$overallScore' },
      },
    },
  ]);

module.exports = { create, findByInterview, aggregateAverages };
