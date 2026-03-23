// routes/logs.js
const express = require("express");
const router = express.Router();
const {
  getLogs,
  getLogsByType,
  searchLogs,
  getLogStats,
  getLogsPaginated,
  clearAllLogs,
  clearOldLogs,
  getLogById
} = require("../controllers/logController");

// Get all logs (latest 100)
router.get("/", getLogs);

// Get logs filtered by type (request/response)
router.get("/type/:type", getLogsByType);

// Search logs by query parameters
router.get("/search", searchLogs);

// Get log statistics
router.get("/stats", getLogStats);
router.get('/logs/:id', getLogById);
// Get paginated logs
router.get("/paginated", getLogsPaginated);

// Clear all logs (requires confirmation)
router.delete("/clear", clearAllLogs);

// Clear logs older than specified days
router.delete("/clear/old", clearOldLogs);

module.exports = router;