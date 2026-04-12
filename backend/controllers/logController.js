// controllers/logController.js


const { successResponse, errorResponse } = require("../utils/response");
const logService = require("../services/logService");

// Get latest logs
const getLogs = async (req, res) => {
  try {
    const logs = await logService.getLogs(100);
    return successResponse(res, "Logs fetched", logs, 200);
  } catch (err) {
    return errorResponse(res, "Failed to fetch logs", err.message, 500);
  }
};

// Get log by ID
const getLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await logService.getLogById(id);
    if (!log) {
      return errorResponse(res, "Log not found", null, 404);
    }
    return successResponse(res, "Log fetched successfully", log, 200);
  } catch (err) {
    return errorResponse(res, "Failed to fetch log", err.message, 500);
  }
};

// Get logs filtered by type
const getLogsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const filteredLogs = await logService.getLogsByType(type, limit);
    return successResponse(res, "Logs fetched by type", filteredLogs, 200);
  } catch (err) {
    return errorResponse(res, err.message || "Failed to fetch logs by type", err.message, 500);
  }
};

// Search logs
const searchLogs = async (req, res) => {
  try {
    const filteredLogs = await logService.searchLogs(req.query);
    return successResponse(res, "Logs searched", filteredLogs, 200);
  } catch (err) {
    return errorResponse(res, "Failed to search logs", err.message, 500);
  }
};

// Get log statistics
const getLogStats = async (req, res) => {
  try {
    const stats = await logService.getLogStats();
    return successResponse(res, "Log stats retrieved", stats, 200);
  } catch (err) {
    return errorResponse(res, "Failed to get log stats", err.message, 500);
  }
};

// Get paginated logs
const getLogsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const data = await logService.getLogsPaginated(page, limit);
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
    const result = await logService.clearAllLogs();
    return successResponse(res, "All logs cleared successfully", result, 200);
  } catch (err) {
    return errorResponse(res, "Failed to clear logs", err.message, 500);
  }
};

// Clear logs older than specified days
const clearOldLogs = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const result = await logService.clearOldLogs(days);
    return successResponse(res, "Old logs cleared successfully", result, 200);
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