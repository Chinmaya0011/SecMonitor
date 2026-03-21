// utils/logger.js
const { createLogger, format, transports } = require("winston");
require("winston-mongodb"); // import MongoDB transport

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    // Logs to MongoDB
    new transports.MongoDB({
      db:process.env.MONGO_URI,
      collection: "request_logs",
      tryReconnect: true,
      options: { useUnifiedTopology: true },
    }),
    // Optional: log to console as well
    new transports.Console({ format: format.simple() }),
  ],
});

module.exports = logger;