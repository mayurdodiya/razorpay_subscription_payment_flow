// logger.js
const winston = require('winston');

// Define custom log format
const simpleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Custom timestamp format
  winston.format.colorize(), // Colorize log levels (info, warn, error)
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`; // Simplified format
  })
);

// Create the logger instance
const logger = winston.createLogger({
  level: 'info',  // Set default log level
  format: simpleFormat,  // Apply the custom format
  transports: [
    new winston.transports.Console(),  // Log to console
    new winston.transports.File({ filename: 'app.log' })  // Log to file
  ]
});

module.exports = logger;
