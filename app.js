const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const userRoutes = require('./folders/routes/user.routes');
// const session = require('express-session');
const passport = require('passport');
// const { sendError } = require('./folders/middlewares/response.middleware');
require('./config/passport.config');

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use('/api/v1', userRoutes);

// Set up session for passport
// app.use(session({
//     secret: process.env.JWT_SECRET,
//     resave: false,
//     saveUninitialized: true
// }));

// app.get('/protected', (req, res) => {
//     if (!req.user) {
//         return sendError(res, { statusCode: 401, details: '' }, 'Unauthorized access');
//     }
//     return sendSuccess(res, { message: 'This is a protected route', user: req.user }, '');
// });

// Initialize Passport.js
app.use(passport.initialize());
// app.use(passport.session());

module.exports = app;
