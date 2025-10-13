const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const passport = require('passport');
const cors = require("cors");
const requestLogger = require('./folders/middlewares/requestLogger');
const configureRoutes = require('./config/routes.config');
require('./config/passport.config');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cors())
app.use(requestLogger);

configureRoutes(app);

module.exports = app;
