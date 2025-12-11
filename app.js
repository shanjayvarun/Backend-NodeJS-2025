const express = require('express');
const connectDB = require('./config/db.config');
const passport = require('passport');
const cors = require("cors");
const requestLogger = require('./folders/middlewares/requestLogger');
const configureRoutes = require('./config/routes.config');
require('./config/passport.config');
const logger = require('./config/logger');
const { sendError } = require('./folders/utility/responses');
require('./config/redis');

connectDB();
const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cors());
app.use(requestLogger);

configureRoutes(app);

app.use((err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });
    sendError(res, 500, "Internal Server Error");
});

module.exports = app;
