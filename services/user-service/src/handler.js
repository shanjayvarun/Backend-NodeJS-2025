const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const environment = require('./config/env');
const { attachRequestId, logRequest } = require('./middlewares/request.middleware');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

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
    message: 'User service is running',
  });
});

app.get('/ready', (_, res) => {
  const isReady = mongoose.connection.readyState === 1;
  res.status(isReady ? 200 : 503).json({
    status: isReady,
    service: environment.serviceName,
    database: isReady ? 'connected' : 'disconnected',
  });
});

app.use('/api/users', userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
