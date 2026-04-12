// services/logService.js
const mongoose = require("mongoose");
const LogCollection = mongoose.connection.collection("request_logs");

// Helper function to parse log data
const parseLogData = (log) => {
  try {
    if (log.metadata && typeof log.metadata === 'object') return log.metadata;
    if (log.meta && typeof log.meta === 'object') return log.meta;
    if (log.message && typeof log.message === 'string' && (log.message === 'REQUEST_LOG' || log.message === 'RESPONSE_LOG')) return log.metadata || log.meta || {};
    if (log.message && typeof log.message === 'string') {
      try {
        const parsed = JSON.parse(log.message);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) {}
    }
    return {};
  } catch (error) {
    return {};
  }
};

const isRequestLog = (log) => {
  if (log.message === 'REQUEST_LOG') return true;
  const data = parseLogData(log);
  if (data.type === 'request') return true;
  if (data.ip && data.headers && !data.responseTime) return true;
  if (data.method && data.url && !data.responseTime) return true;
  return false;
};

const isResponseLog = (log) => {
  if (log.message === 'RESPONSE_LOG') return true;
  const data = parseLogData(log);
  if (data.type === 'response') return true;
  if (data.responseTime && data.contentLength) return true;
  if (data.statusCode && data.responseTime) return true;
  return false;
};

module.exports = {
  LogCollection,
  parseLogData,
  isRequestLog,
  isResponseLog
};
