const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const userRoutes = require('./folders/routes/user.routes');
const passport = require('passport');
require('./config/passport.config');

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use('/api/v1', userRoutes);
app.use(passport.initialize());

module.exports = app;
