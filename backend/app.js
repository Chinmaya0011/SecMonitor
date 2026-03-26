require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const requestLogger = require("./middleware/requestLogger");
const responseLogger = require("./middleware/responseLogger");
const userRoutes = require("./routes/Users");
const logsRoute = require("./routes/logs");

const app = express();




const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS blocked ❌"));
  },
  credentials: true
}));
app.use(express.json());
app.use(requestLogger);
app.use(responseLogger);
app.use(cookieParser());
// Routes (attach routers BEFORE exporting)
app.use("/api/user", userRoutes);
app.use("/api/logs", logsRoute);

// Health check
app.get("/", (req, res) => res.send("SecMonitor Backend API Running"));

// Export app ONLY (no app.listen)
module.exports = app;