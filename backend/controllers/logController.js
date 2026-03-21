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

// Get latest 100 logs
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

// Get logs filtered by type (request/response)
const getLogsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    let filter = {};

    if (type === 'request') {
      // Request logs have ip, headers, body but no responseTime
      filter = {
        $and: [
          { "message": { $regex: '"ip":' } },
          { "message": { $regex: '"headers":' } },
          { "message": { $not: { $regex: '"responseTime":' } } }
        ]
      };
    } else if (type === 'response') {
      // Response logs have responseTime and contentLength
      filter = {
        $and: [
          { "message": { $regex: '"responseTime":' } },
          { "message": { $regex: '"contentLength":' } }
        ]
      };
    } else {
      return errorResponse(res, "Invalid type. Use 'request' or 'response'", null, 400);
    }

    const logs = await LogCollection
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return successResponse(res, "Logs fetched by type", logs, 200);
  } catch (err) {
    return errorResponse(res, "Failed to fetch logs by type", err.message, 500);
  }
};

// Search logs by query parameters
const searchLogs = async (req, res) => {
  try {
    const { q, method, statusCode, ip, limit = 100 } = req.query;
    let filter = {};

    // Build filter based on query parameters
    if (q) {
      filter.$or = [
        { "message": { $regex: q, $options: 'i' } }
      ];
    }

    if (method) {
      filter["message"] = filter["message"] || {};
      filter["message"].$regex = filter["message"].$regex || "";
      filter["message"].$regex += `"method":"${method}"`;
    }

    if (statusCode) {
      filter["message"] = filter["message"] || {};
      filter["message"].$regex = filter["message"].$regex || "";
      filter["message"].$regex += `"statusCode":${statusCode}`;
    }

    if (ip) {
      filter["message"] = filter["message"] || {};
      filter["message"].$regex = filter["message"].$regex || "";
      filter["message"].$regex += `"ip":"${ip}"`;
    }

    const logs = await LogCollection
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .toArray();

    return successResponse(res, "Logs searched", logs, 200);
  } catch (err) {
    return errorResponse(res, "Failed to search logs", err.message, 500);
  }
};

// Get log statistics
const getLogStats = async (req, res) => {
  try {
    const totalLogs = await LogCollection.countDocuments();

    // Count by level
    const errorLogs = await LogCollection.countDocuments({ level: 'error' });
    const warnLogs = await LogCollection.countDocuments({ level: 'warn' });
    const infoLogs = await LogCollection.countDocuments({ level: 'info' });

    // Count request vs response logs
    const requestLogs = await LogCollection.countDocuments({
      $and: [
        { "message": { $regex: '"ip":' } },
        { "message": { $regex: '"headers":' } },
        { "message": { $not: { $regex: '"responseTime":' } } }
      ]
    });

    const responseLogs = await LogCollection.countDocuments({
      $and: [
        { "message": { $regex: '"responseTime":' } },
        { "message": { $regex: '"contentLength":' } }
      ]
    });

    // Get recent activity (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = await LogCollection.countDocuments({
      timestamp: { $gte: oneDayAgo }
    });

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
      recent: recentLogs
    };
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

module.exports = {
  getLogs,
  getLogsByType,
  searchLogs,
  getLogStats,
  getLogsPaginated
};