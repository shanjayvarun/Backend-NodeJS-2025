const express = require('express');
const connectDB = require('./config/db.config');
const passport = require('passport');
const cors = require("cors");
const requestLogger = require('./folders/middlewares/requestLogger');
const configureRoutes = require('./config/routes.config');
require('./config/passport.config');
const logger = require('./config/logger');

connectDB();
const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cors());
app.use(requestLogger);

app.get("/test-error", (req, res) => {
  throw new Error("CloudWatch Alarm Test Error");
});

configureRoutes(app);

// 👇 Global Error Logger - LAST middleware
app.use((err, req, res, next) => {
    const logData = {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        headers: req.headers,
    };

    logger.error(logData);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

module.exports = app;