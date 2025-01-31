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

//App routes <-- START -->
app.use(`/${process.env.SUBDOMAIN}/${process.env.VERSION}/users`, userRoutes);
app.use(`/${process.env.SUBDOMAIN}/${process.env.VERSION}/tasks`, taskRoutes);
//App routes <-- END -->

module.exports = app;
