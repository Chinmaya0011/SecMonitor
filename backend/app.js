require("dotenv").config();
const express = require("express");
const cors = require("cors");
const requestLogger = require("./middleware/requestLogger");
const responseLogger = require("./middleware/responseLogger");
const userRoutes = require("./routes/Users");
const logsRoute = require("./routes/logs");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(responseLogger);

// Routes (attach routers BEFORE exporting)
app.use("/api/user", userRoutes);
app.use("/api/logs", logsRoute);

// Health check
app.get("/", (req, res) => res.send("SecMonitor Backend API Running"));

// Export app ONLY (no app.listen)
module.exports = app;