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


// Service methods
const getLogs = async (limit = 100) => {
  return await LogCollection.find({}).sort({ timestamp: -1 }).limit(limit).toArray();
};

const getLogById = async (id) => {
  return await LogCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });
};

const getLogsByType = async (type, limit = 100) => {
  const allLogs = await LogCollection.find({}).sort({ timestamp: -1 }).limit(limit * 2).toArray();
  let filteredLogs = [];
  if (type === 'request') filteredLogs = allLogs.filter(isRequestLog);
  else if (type === 'response') filteredLogs = allLogs.filter(isResponseLog);
  else throw new Error("Invalid type. Use 'request' or 'response'");
  return filteredLogs.slice(0, limit);
};

const searchLogs = async (query) => {
  const { q, method, statusCode, ip, limit = 100 } = query;
  const allLogs = await LogCollection.find({}).sort({ timestamp: -1 }).limit(parseInt(limit) * 2).toArray();
  let filteredLogs = allLogs.filter(log => {
    const data = parseLogData(log);
    if (q) {
      const searchLower = q.toLowerCase();
      const logString = JSON.stringify(data).toLowerCase();
      if (!logString.includes(searchLower)) return false;
    }
    if (method && data.method?.toLowerCase() !== method.toLowerCase()) return false;
    if (statusCode && data.statusCode?.toString() !== statusCode) return false;
    if (ip && data.ip !== ip) return false;
    return true;
  });
  return filteredLogs.slice(0, parseInt(limit));
};

const getLogStats = async () => {
  const allLogs = await LogCollection.find({}).toArray();
  const totalLogs = allLogs.length;
  const errorLogs = allLogs.filter(log => log.level === 'error').length;
  const warnLogs = allLogs.filter(log => log.level === 'warn').length;
  const infoLogs = allLogs.filter(log => log.level === 'info').length;
  const requestLogs = allLogs.filter(isRequestLog).length;
  const responseLogs = allLogs.filter(isResponseLog).length;
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentLogs = allLogs.filter(log => {
    const timestamp = log.timestamp || log.metadata?.timestamp;
    return timestamp && new Date(timestamp) >= oneDayAgo;
  }).length;
  const uniqueUrls = [...new Set(allLogs.map(log => parseLogData(log).url).filter(url => url && typeof url === 'string'))];
  const uniqueIps = [...new Set(allLogs.map(log => parseLogData(log).ip).filter(ip => ip && typeof ip === 'string'))];
  return {
    total: totalLogs,
    byLevel: { error: errorLogs, warn: warnLogs, info: infoLogs },
    byType: { request: requestLogs, response: responseLogs },
    recent: recentLogs,
    uniqueUrls: uniqueUrls.length,
    uniqueIps: uniqueIps.length,
    debug: {
      hasRequestType: allLogs.some(log => log.message === 'REQUEST_LOG'),
      hasResponseType: allLogs.some(log => log.message === 'RESPONSE_LOG'),
      sampleLog: allLogs.length > 0 ? allLogs[0] : null
    }
  };
};

const getLogsPaginated = async (page = 1, limit = 50) => {
  const skip = (page - 1) * limit;
  const total = await LogCollection.countDocuments();
  const logs = await LogCollection.find({}).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray();
  return {
    logs,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalLogs: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};

const clearAllLogs = async () => {
  const totalBefore = await LogCollection.countDocuments();
  if (totalBefore === 0) return { deletedCount: 0 };
  const result = await LogCollection.deleteMany({});
  return { deletedCount: result.deletedCount, timestamp: new Date().toISOString(), message: `Successfully cleared ${result.deletedCount} log entries` };
};

const clearOldLogs = async (days = 30) => {
  const daysToKeep = parseInt(days);
  if (isNaN(daysToKeep) || daysToKeep < 0) throw new Error("Invalid days parameter. Must be a positive number");
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  const result = await LogCollection.deleteMany({ timestamp: { $lt: cutoffDate } });
  return { deletedCount: result.deletedCount, keptDays: daysToKeep, cutoffDate: cutoffDate.toISOString(), message: `Cleared ${result.deletedCount} logs older than ${daysToKeep} days` };
};

module.exports = {
  LogCollection,
  parseLogData,
  isRequestLog,
  isResponseLog,
  getLogs,
  getLogById,
  getLogsByType,
  searchLogs,
  getLogStats,
  getLogsPaginated,
  clearAllLogs,
  clearOldLogs
};
