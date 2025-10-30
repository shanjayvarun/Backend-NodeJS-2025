const mongoose = require('mongoose');
const logger = require('./logger');
const environment = require('../config/env.config')

const connectDB = async () => {
  try {
    await mongoose.connect(environment.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tlsAllowInvalidCertificates: true,
    });
    logger.info(`MongoDB Connected in ${environment.mode} in ${environment.mongoUri}`)
  } catch (error) {
    logger.error(`MongoDB Connection Failed in ${environment.mode} in ${environment.mongoUri}`, error)
    process.exit(1);
  }
};

module.exports = connectDB;