const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
const projectRoot = path.resolve(__dirname, '../../../..');

dotenv.config({ path: path.resolve(projectRoot, envFile), override: true });
// Hello \test

const getRequiredEnv = (key) => {
  const value = process.env[key];
  if (!value || value.startsWith('replace-with')) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getCorsOrigins = () => {
  if (!process.env.CORS_ORIGINS) return [];
  return process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean);
};

module.exports = {
  mode: process.env.NODE_ENV,
  port: process.env.PORT,
  version: process.env.VERSION,
  serviceName: process.env.SERVICE_NAME || 'auth-service',
  mongoUri: getRequiredEnv('MONGO_URI'),
  corsOrigins: getCorsOrigins(),
  jwt: {
    accessSecret: getRequiredEnv('JWT_ACCESS_SECRET'),
    refreshSecret: getRequiredEnv('JWT_REFRESH_SECRET'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    algorithm: process.env.JWT_ALGO || 'HS256',
  },
};
