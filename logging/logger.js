const winston = require("winston");

const { format } = winston;
const DailyRotateFile = require("winston-daily-rotate-file");

const errorTransport = new DailyRotateFile({
  filename: "logs/error-%DATE%/error.log",
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxSize: "20m",
  maxFiles: "30d",
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
});

const infoTransport = new DailyRotateFile({
  filename: "logs/info-%DATE%/info.log",
  datePattern: "YYYY-MM-DD",
  level: "info",
  maxSize: "20m",
  maxFiles: "30d",
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
});

const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    infoTransport, // Log info messages to a daily folder
    errorTransport, // Log error messages to a daily folder
    new winston.transports.Console(), // Log to the console for development
  ],
});

module.exports = { logger };
