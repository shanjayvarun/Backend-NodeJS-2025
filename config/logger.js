const winston = require('winston');
require('winston-daily-rotate-file');
require('winston-cloudwatch');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const environment = require('../config/env.config');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const { combine, timestamp, printf, colorize, json, align } = winston.format;

// 🎨 Custom colorized console format
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  align(),
  printf(info => {
    const emoji =
      info.level.includes('error') ? '❌' :
      info.level.includes('warn') ? '⚠️' :
      info.level.includes('info') ? 'ℹ️' :
      info.level.includes('debug') ? '🐛' : '🔹';
    return `${emoji}  ${info.timestamp} [${info.level}]: ${info.message}`;
  })
);

// 🧩 prod format (for CloudWatch and files)
const prodFormat = combine(timestamp(), json());

// 🔄 Daily rotate log files
const dailyRotateFile = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// ⚠️ Separate error logs
const errorFile = new winston.transports.File({
  filename: path.join(logDir, 'error.log'),
  level: 'error',
});

const transports = [dailyRotateFile, errorFile];

// ☁️ CloudWatch (prod only)
if (environment.mode === 'prod') {
  const WinstonCloudWatch = require('winston-cloudwatch');
  transports.push(
    new WinstonCloudWatch({
      logGroupName: environment.cloudwatch.group || 'crm-app-logs',
      logStreamName: environment.cloudwatch.stream || 'backend-stream',
      awsRegion: environment.aws.region || 'ap-southeast-2',
      jsonMessage: true,
      retentionInDays: 14,
    })
  );
}

// 🧱 Create Logger
const logger = winston.createLogger({
  level: environment.mode === 'development' ? 'debug' : 'info',
  format: environment.mode === 'development' ? consoleFormat : prodFormat,
  defaultMeta: { service: 'crm-backend', env: environment.mode },
  transports,
});

// ✅ Always log to console (even in PM2)
logger.add(
  new winston.transports.Console({
    format: consoleFormat,
  })
);

module.exports = logger;
