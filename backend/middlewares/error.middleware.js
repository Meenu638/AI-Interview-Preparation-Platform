const ApiError = require('../utils/ApiError');

// Convert known Mongoose/JS errors into ApiError instances
const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  if (err.name === 'CastError') {
    return ApiError.badRequest(`Invalid value for ${err.path}: ${err.value}`);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return ApiError.conflict(`${field} already exists.`);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return ApiError.badRequest('Validation failed', errors);
  }

  if (err.name === 'JsonWebTokenError') {
    return ApiError.unauthorized('Invalid token.');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Token expired.');
  }

  return new ApiError(err.statusCode || 500, err.message || 'Internal server error');
};

const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const error = normalizeError(err);

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    message: error.message || 'Something went wrong',
    errors: error.errors || [],
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
