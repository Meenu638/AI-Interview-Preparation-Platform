const Resume = require('../models/Resume');

const create = (data) => Resume.create(data);

const findByUser = (userId) => Resume.find({ user: userId, isActive: true }).sort('-createdAt');

const findById = (id) => Resume.findById(id);

const findLatestByUser = (userId) => Resume.findOne({ user: userId, isActive: true }).sort('-createdAt');

const deactivate = (id) => Resume.findByIdAndUpdate(id, { isActive: false });

module.exports = { create, findByUser, findById, findLatestByUser, deactivate };
