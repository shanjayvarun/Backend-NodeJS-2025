const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
const projectRoot = path.resolve(__dirname, '../../../..');

dotenv.config({ path: path.resolve(projectRoot, envFile) });

module.exports = {
  mode: process.env.NODE_ENV,
  port: process.env.PORT,
  version: process.env.VERSION,
  mongoUri: process.env.MONGO_URI,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    algorithm: process.env.JWT_ALGO,
  },
};
