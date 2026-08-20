const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error({ err }, 'Unhandled error occurred');

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map((e) => e.message).join(', '),
    });
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // Duplicate key error (e.g. email already exists)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate value entered',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Fallback — unknown error
  res.status(err.status || 500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
  });
};

module.exports = errorHandler;