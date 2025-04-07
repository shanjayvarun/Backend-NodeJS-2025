const { ROUTE_PREFIX } = require('../folders/utility/enum');
const userRoutes = require('../folders/routes/user.routes');
const taskRoutes = require('../folders/routes/task.routes');
const blogRoutes = require('../folders/routes/blog.routes');
const productRoutes = require('../folders/routes/product.routes');
const utilityRoutes = require('../folders/routes/utility.routes');
// const chatRoutes = require('../folders/routes/chat.routes');

const configureRoutes = (app) => {
  app.use(`${ROUTE_PREFIX}/users`, userRoutes);
  app.use(`${ROUTE_PREFIX}/tasks`, taskRoutes);
  app.use(`${ROUTE_PREFIX}/blogs`, blogRoutes);
  app.use(`${ROUTE_PREFIX}/utility`, utilityRoutes);
  app.use(`${ROUTE_PREFIX}/products`, productRoutes);
  // app.use(`/${ROUTE_PREFIX}/chats`, chatRoutes);
};

module.exports = configureRoutes;