// utils/logger.js

const { createLogger, format, transports } = require("winston");
let logger;

if (process.env.NODE_ENV === "production") {
  require("winston-mongodb"); // import MongoDB transport only in production
  logger = createLogger({
    level: "info",
    format: format.combine(
      format.timestamp(),
      format.json()
    ),
    transports: [
      new transports.MongoDB({
        db: process.env.MONGO_URI,
        collection: "request_logs",
        tryReconnect: true,
        options: { useUnifiedTopology: true },
      }),
      new transports.Console({ format: format.simple() }),
    ],
  });
} else {
  // Development: log only warnings and errors to console
  logger = createLogger({
    level: "warn",
    format: format.combine(
      format.timestamp(),
      format.simple()
    ),
    transports: [
      new transports.Console(),
    ],
  });
}

module.exports = logger;