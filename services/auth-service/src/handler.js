/* eslint-disable node/no-extraneous-require */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const environment = require('./config/env');
const { attachRequestId, logRequest } = require('./middlewares/request.middleware');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');
const { ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { ddbClient } = require('./config/dynamo');

const app = express();
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || environment.corsOrigins.length === 0 || environment.corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS Not Allowed'));
  },
};

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));
app.use(attachRequestId);
app.use(logRequest);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

app.get('/health', (_, res) => {
  res.status(200).json({
    status: true,
    service: environment.serviceName,
    message: 'Auth service is running',
  });
});

app.get('/ddbready', async (_, res) => {
  try {
    await ddbClient.send(new ListTablesCommand({ Limit: 1 }));
    res.status(200).json({
      status: true,
      service: environment.serviceName,
      database: 'connected (DynamoDB)',
    });
  } catch (error) {
    console.error('Readiness probe failed to reach DynamoDB:', error.message);
    res.status(503).json({
      status: false,
      service: environment.serviceName,
      database: 'disconnected',
      error: error.message
    });
  }
});

app.use('/api/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
