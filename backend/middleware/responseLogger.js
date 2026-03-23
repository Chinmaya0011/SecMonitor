// middlewares/responseLogger.js
const logger = require("../utils/logger");

// IMPORTANT: this middleware logs response metadata in 'finish' event, after the backend has sent the response.
// It does not log request body again, only response attributes and timing.
const responseLogger = (req, res, next) => {
  // Skip logging for /api/log* routes
  if (req.originalUrl && req.originalUrl.match(/^\/api\/log/)) {
    return next();
  }

  const start = process.hrtime.bigint(); // High-resolution timing for accurate response time

  res.on('finish', () => {
    try {
      const end = process.hrtime.bigint();
      const responseTimeMs = Number(end - start) / 1000000;

      const logData = {
        type: 'response',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${responseTimeMs.toFixed(2)}ms`,
        contentLength: res.get('Content-Length') || 'unknown',
        referrer: req.get('Referer') || '',
        userAgent: req.get('User-Agent') || 'unknown'
      };

      logger.info('RESPONSE_LOG', logData);
    } catch (err) {
      logger.warn('RESPONSE_LOG_FAILED', { error: err.message });
    }
  });

  next();
};

module.exports = responseLogger;