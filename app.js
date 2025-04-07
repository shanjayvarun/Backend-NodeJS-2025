const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const passport = require('passport');
const cors = require("cors");
const userRoutes = require('./folders/routes/user.routes');
const taskRoutes = require('./folders/routes/task.routes');
const blogRoutes = require('./folders/routes/blog.routes');
const productRoutes = require('./folders/routes/product.routes')
const utilityRoutes = require('./folders/routes/utility.routes');
const chatRoutes = require('./folders/routes/chat.routes');
const requestLogger = require('./folders/middlewares/requestLogger');
require('./config/passport.config');

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(cors())
app.use(requestLogger);

//App routes <-- START -->
app.use(`/${process.env.SUBDOMAIN}/${process.env.VERSION}/users`, userRoutes);
app.use(`/${process.env.SUBDOMAIN}/${process.env.VERSION}/tasks`, taskRoutes);
app.use(`/${process.env.SUBDOMAIN}/${process.env.VERSION}/blogs`, blogRoutes);
app.use(`/${process.env.SUBDOMAIN}/${process.env.VERSION}/utility`, utilityRoutes);
app.use(`/${process.env.SUBDOMAIN}/${process.env.VERSION}/products`, productRoutes);
// app.use(`/${process.env.SUBDOMAIN}/${process.env.VERSION}/chats`, chatRoutes);
//App routes <-- END -->

module.exports = app;
