// routes/logs.js
const express = require("express");
const router = express.Router();
const {
  getLogs,
  getLogsByType,
  searchLogs,
  getLogStats,
  getLogsPaginated
} = require("../controllers/logController");

// Get all logs (latest 100)
router.get("/", getLogs);

// Get logs filtered by type (request/response)
router.get("/type/:type", getLogsByType);

// Search logs by query parameters
router.get("/search", searchLogs);

// Get log statistics
router.get("/stats", getLogStats);

// Get paginated logs
router.get("/paginated", getLogsPaginated);

module.exports = router;