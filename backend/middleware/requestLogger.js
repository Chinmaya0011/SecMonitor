// middlewares/requestLogger.js
const logger = require("../utils/logger");

// IMPORTANT: this middleware records incoming request metadata for tracing and audit.
// It avoids noisy/unnecessary details while preserving important info for debugging.
const requestLogger = (req, res, next) => {
  try {
    const logData = {
      type: 'request',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      // Include request body only if there is content and not too big
      body: req.body && Object.keys(req.body).length > 0 ? req.body : undefined,
      // Don't include full headers by default to avoid noise and potential sensitive fields.
      headers: {
        host: req.get('Host'),
        referer: req.get('Referer') || '',
        'x-forwarded-for': req.get('X-Forwarded-For') || ''
      }
    };

    logger.info('REQUEST_LOG', logData);
  } catch (err) {
    // Fail-safe: ensure logging errors do not crash requests.
    logger.warn('REQUEST_LOG_FAILED', { error: err.message });
  }

  next();
};

module.exports = requestLogger;