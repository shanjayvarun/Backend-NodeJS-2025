const winston = require('winston');
require('winston-daily-rotate-file');
require('winston-cloudwatch');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const environment = require('../config/env.config');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const { combine, timestamp, json, errors, colorize, printf, align } = winston.format;

// Console formatting for readability in dev/prod logs
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  align(),
  printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
);

// Production structured format for CloudWatch + files
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }), // 👈 ensures stack is a field, not inside message
  json()
);

// Log files
const dailyRotateFile = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});
const errorFile = new winston.transports.File({
  filename: path.join(logDir, 'error.log'),
  level: 'error',
});

const transports = [dailyRotateFile, errorFile];

// CloudWatch only in prod
if (environment.mode === 'prod') {
  const WinstonCloudWatch = require('winston-cloudwatch');
  transports.push(
    new WinstonCloudWatch({
      logGroupName: environment.cloudwatch.group || 'crm-app-logs',
      logStreamName: environment.cloudwatch.stream || 'backend-stream',
      awsRegion: environment.aws.region || 'ap-southeast-2',
      jsonMessage: true,
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: prodFormat,
  defaultMeta: { service: 'crm-backend', env: environment.mode },
  transports,
});

// Always log to console too
logger.add(new winston.transports.Console({ format: consoleFormat }));

module.exports = logger;
