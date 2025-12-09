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

// 🎨 Pretty format for console logs
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  align(),
  printf(info => {
    const emoji =
      info.level === 'error' ? '❌' :
      info.level === 'warn' ? '⚠️' :
      info.level === 'info' ? 'ℹ️' :
      '🔹';
    return `${emoji}  ${info.timestamp} [${info.level}]: ${info.message}`;
  })
);

// 📦 Format for files & CloudWatch
const prodFormat = combine(timestamp(), json());

// 🔄 Local rotating logs
const dailyRotateFile = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
});

// ❌ Separate file for error logs
const errorFile = new winston.transports.File({
  filename: path.join(logDir, 'error.log'),
  level: 'error',
});

// 🧱 Base transports (local logging)
const transports = [dailyRotateFile, errorFile];

// ☁️ CloudWatch enabled only in PROD
if (environment.mode === 'prod') {
  const WinstonCloudWatch = require('winston-cloudwatch');

  transports.push(
    new WinstonCloudWatch({
      level: 'error', // 👈 only errors go to CloudWatch
      logGroupName: environment.cloudwatch?.group || 'crm-app-logs',
      logStreamName: environment.cloudwatch?.stream || 'backend-stream',
      awsRegion: environment.aws?.region || 'ap-southeast-2',
      jsonMessage: true,
      retentionInDays: 14,

      // 🔐 Required for CloudWatch logging
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    })
  );
}

// 🎯 Create logger
const logger = winston.createLogger({
  level: environment.mode === 'prod' ? 'error' : 'debug',
  format: environment.mode === 'prod' ? prodFormat : consoleFormat,
  defaultMeta: { service: 'crm-backend', env: environment.mode },
  transports,
});

// 📺 Always show logs in console
logger.add(
  new winston.transports.Console({
    format: consoleFormat,
  })
);

module.exports = logger;
