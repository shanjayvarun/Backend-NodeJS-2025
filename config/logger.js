const winston = require('winston');
require('winston-daily-rotate-file');
require('winston-cloudwatch');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const { combine, timestamp, printf, colorize, json, align } = winston.format;

const devFormat = combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
);

const prodFormat = combine(timestamp(), json());

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

// 🧠 Add CloudWatch transport only in production
if (process.env.NODE_ENV === 'production') {
    const WinstonCloudWatch = require('winston-cloudwatch');
    transports.push(
        new WinstonCloudWatch({
            logGroupName: process.env.CLOUDWATCH_GROUP || 'crm-app-logs',
            logStreamName: process.env.CLOUDWATCH_STREAM || 'backend-stream',
            awsRegion: process.env.AWS_REGION || 'us-east-1',
            jsonMessage: true,
            retentionInDays: 14,
        })
    );
}

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: process.env.NODE_ENV === 'development' ? devFormat : prodFormat,
    defaultMeta: { service: 'crm-backend', env: process.env.NODE_ENV },
    transports,
});

if (process.env.NODE_ENV === 'development') {
    logger.add(new winston.transports.Console({ format: devFormat }));
}

module.exports = logger;
