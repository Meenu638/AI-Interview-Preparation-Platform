const Answer = require('../models/Answer');

const create = (data) => Answer.create(data);

const findById = (id) => Answer.findById(id).populate('feedback');

const findByInterview = (interviewId) => Answer.find({ interview: interviewId }).populate('feedback');

const updateById = (id, updates) =>
  Answer.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

const attachFeedback = (id, feedbackId) =>
  Answer.findByIdAndUpdate(id, { feedback: feedbackId }, { new: true });

module.exports = { create, findById, findByInterview, updateById, attachFeedback };
