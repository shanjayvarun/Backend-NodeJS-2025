const mongoose = require('mongoose');
const http = require('http');
const app = require('./src/handler');
const environment = require('./src/config/env');

const server = http.createServer(app);

mongoose
  .connect(environment.mongoUri)
  .then(() => {
    server.listen(environment.port || 4002, () => {
      console.log(`User service started on port ${environment.port || 4002}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB for user service:', error.message);
    process.exit(1);
  });

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down user service.`);
  server.close(async () => {
    await mongoose.connection.close();
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced user service shutdown after timeout');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
