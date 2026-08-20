const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error({ err }, 'Unhandled error occurred');
  res.status(err.status || 500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
  });
};

module.exports = errorHandler;