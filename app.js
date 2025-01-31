const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const passport = require('passport');
const userRoutes = require('./folders/routes/user.routes');
const taskRoutes = require('./folders/routes/task.routes');
require('./config/passport.config');

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);

module.exports = app;
