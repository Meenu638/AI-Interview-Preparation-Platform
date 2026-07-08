const Analytics = require('../models/Analytics');

const upsertPeriod = (userId, period, periodStart, periodEnd, data) =>
  Analytics.findOneAndUpdate(
    { user: userId, period, periodStart },
    { $set: { periodEnd, ...data } },
    { upsert: true, new: true }
  );

const findByUserAndPeriod = (userId, period, limit = 12) =>
  Analytics.find({ user: userId, period }).sort('-periodStart').limit(limit);

module.exports = { upsertPeriod, findByUserAndPeriod };
