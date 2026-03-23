// controllers/logController.js
const mongoose = require("mongoose");
const { successResponse, errorResponse } = require("../utils/response");

exports.getUser = async (req, res) => {
  try {
    const user = { id: 1, name: "Chinu" };
    return successResponse(res, "User fetched", user);
  } catch (err) {
    return errorResponse(res, "Something went wrong", err.message);
  }
};

const LogCollection = mongoose.connection.collection("request_logs");

// Helper function to parse log data
const parseLogData = (log) => {
  try {
    // Check if metadata exists
    if (log.metadata && typeof log.metadata === 'object') {
      return log.metadata;
    }
    
    // Check if meta exists
    if (log.meta && typeof log.meta === 'object') {
      return log.meta;
    }
    
    // Check if message contains JSON
    if (log.message && typeof log.message === 'string' && 
        (log.message === 'REQUEST_LOG' || log.message === 'RESPONSE_LOG')) {
      return log.metadata || log.meta || {};
    }
    
    // Try to parse message as JSON
    if (log.message && typeof log.message === 'string') {
      try {
        const parsed = JSON.parse(log.message);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch (e) {
        // Not JSON, ignore
      }
    }
    
    return {};
  } catch (error) {
    console.error('Error parsing log:', error);
    return {};
  }
};

// Determine if log is a request log
const isRequestLog = (log) => {
  if (log.message === 'REQUEST_LOG') return true;
  
  const data = parseLogData(log);
  
  // Check by type field
  if (data.type === 'request') return true;
  
  // Check by presence of request-specific fields
  if (data.ip && data.headers && !data.responseTime) return true;
  if (data.method && data.url && !data.responseTime) return true;
  
  return false;
};

// Determine if log is a response log
const isResponseLog = (log) => {
  if (log.message === 'RESPONSE_LOG') return true;
  
  const data = parseLogData(log);
  
  // Check by type field
  if (data.type === 'response') return true;
  
  // Check by presence of response-specific fields
  if (data.responseTime && data.contentLength) return true;
  if (data.statusCode && data.responseTime) return true;
  
  return false;
};

// Get latest logs
const getLogs = async (req, res) => {
  try {
    const logs = await LogCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    return successResponse(res, "Logs fetched", logs, 200);
  } catch (err) {
    return errorResponse(res, "Failed to fetch logs", err.message, 500);
  }
};

// Get log by ID
const getLogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid log ID format", null, 400);
    }
    
    // Find log by ID
    const log = await LogCollection.findOne({ 
      _id: new mongoose.Types.ObjectId(id) 
    });
    
    if (!log) {
      return errorResponse(res, "Log not found", null, 404);
    }
    
    return successResponse(res, "Log fetched successfully", log, 200);
  } catch (err) {
    console.error('Error fetching log by ID:', err);
    return errorResponse(res, "Failed to fetch log", err.message, 500);
  }
};

// Get logs filtered by type
const getLogsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    // Get all logs first then filter in JavaScript
    const allLogs = await LogCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit * 2)
      .toArray();

    let filteredLogs = [];
    if (type === 'request') {
      filteredLogs = allLogs.filter(log => isRequestLog(log));
    } else if (type === 'response') {
      filteredLogs = allLogs.filter(log => isResponseLog(log));
    } else {
      return errorResponse(res, "Invalid type. Use 'request' or 'response'", null, 400);
    }

    // Limit the results
    filteredLogs = filteredLogs.slice(0, limit);

    return successResponse(res, "Logs fetched by type", filteredLogs, 200);
  } catch (err) {
    return errorResponse(res, "Failed to fetch logs by type", err.message, 500);
  }
};

// Search logs
const searchLogs = async (req, res) => {
  try {
    const { q, method, statusCode, ip, limit = 100 } = req.query;
    
    // Get all logs first
    const allLogs = await LogCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(parseInt(limit) * 2)
      .toArray();

    // Filter in JavaScript
    let filteredLogs = allLogs.filter(log => {
      const data = parseLogData(log);
      
      // Search by query string
      if (q) {
        const searchLower = q.toLowerCase();
        const logString = JSON.stringify(data).toLowerCase();
        if (!logString.includes(searchLower)) return false;
      }
      
      // Filter by method
      if (method && data.method?.toLowerCase() !== method.toLowerCase()) return false;
      
      // Filter by status code
      if (statusCode && data.statusCode?.toString() !== statusCode) return false;
      
      // Filter by IP
      if (ip && data.ip !== ip) return false;
      
      return true;
    });

    // Limit results
    filteredLogs = filteredLogs.slice(0, parseInt(limit));

    return successResponse(res, "Logs searched", filteredLogs, 200);
  } catch (err) {
    return errorResponse(res, "Failed to search logs", err.message, 500);
  }
};

// Get log statistics
const getLogStats = async (req, res) => {
  try {
    const allLogs = await LogCollection.find({}).toArray();
    
    const totalLogs = allLogs.length;
    
    // Count by level
    const errorLogs = allLogs.filter(log => log.level === 'error').length;
    const warnLogs = allLogs.filter(log => log.level === 'warn').length;
    const infoLogs = allLogs.filter(log => log.level === 'info').length;
    
    // Count request vs response logs
    const requestLogs = allLogs.filter(log => isRequestLog(log)).length;
    const responseLogs = allLogs.filter(log => isResponseLog(log)).length;
    
    // Get recent activity (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = allLogs.filter(log => {
      const timestamp = log.timestamp || log.metadata?.timestamp;
      return timestamp && new Date(timestamp) >= oneDayAgo;
    }).length;
    
    // Get unique URLs for debugging
    const uniqueUrls = [...new Set(
      allLogs
        .map(log => parseLogData(log).url)
        .filter(url => url && typeof url === 'string')
    )];
    
    // Get unique IPs
    const uniqueIps = [...new Set(
      allLogs
        .map(log => parseLogData(log).ip)
        .filter(ip => ip && typeof ip === 'string')
    )];
    
    const stats = {
      total: totalLogs,
      byLevel: {
        error: errorLogs,
        warn: warnLogs,
        info: infoLogs
      },
      byType: {
        request: requestLogs,
        response: responseLogs
      },
      recent: recentLogs,
      uniqueUrls: uniqueUrls.length,
      uniqueIps: uniqueIps.length,
      debug: {
        hasRequestType: allLogs.some(log => log.message === 'REQUEST_LOG'),
        hasResponseType: allLogs.some(log => log.message === 'RESPONSE_LOG'),
        sampleLog: allLogs.length > 0 ? allLogs[0] : null
      }
    };
    
    return successResponse(res, "Log stats retrieved", stats, 200);
  } catch (err) {
    console.error('Error getting log stats:', err);
    return errorResponse(res, "Failed to get log stats", err.message, 500);
  }
};

// Get paginated logs
const getLogsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const total = await LogCollection.countDocuments();
    const logs = await LogCollection
      .find({})
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const data = {
      logs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLogs: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
    return successResponse(res, "Paginated logs fetched", data, 200);
  } catch (err) {
    return errorResponse(res, "Failed to fetch paginated logs", err.message, 500);
  }
};

// Clear all logs
const clearAllLogs = async (req, res) => {
  try {
    const { confirm } = req.query;
    if (confirm !== 'true') {
      return errorResponse(res, "Confirmation required. Set confirm=true to clear all logs", null, 400);
    }

    const totalBefore = await LogCollection.countDocuments();
    
    if (totalBefore === 0) {
      return successResponse(res, "No logs to clear", { deletedCount: 0 }, 200);
    }

    const result = await LogCollection.deleteMany({});

    console.log(`All logs cleared by ${req.ip || 'unknown'} at ${new Date().toISOString()}. Deleted: ${result.deletedCount} documents`);

    const responseData = {
      deletedCount: result.deletedCount,
      timestamp: new Date().toISOString(),
      message: `Successfully cleared ${result.deletedCount} log entries`
    };

    return successResponse(res, "All logs cleared successfully", responseData, 200);
  } catch (err) {
    return errorResponse(res, "Failed to clear logs", err.message, 500);
  }
};

// Clear logs older than specified days
const clearOldLogs = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysToKeep = parseInt(days);
    
    if (isNaN(daysToKeep) || daysToKeep < 0) {
      return errorResponse(res, "Invalid days parameter. Must be a positive number", null, 400);
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await LogCollection.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    const responseData = {
      deletedCount: result.deletedCount,
      keptDays: daysToKeep,
      cutoffDate: cutoffDate.toISOString(),
      message: `Cleared ${result.deletedCount} logs older than ${daysToKeep} days`
    };

    return successResponse(res, "Old logs cleared successfully", responseData, 200);
  } catch (err) {
    return errorResponse(res, "Failed to clear old logs", err.message, 500);
  }
};

module.exports = {
  getLogs,
  getLogsByType,
  searchLogs,
  getLogStats,
  getLogById,
  getLogsPaginated,
  clearAllLogs,
  clearOldLogs
};