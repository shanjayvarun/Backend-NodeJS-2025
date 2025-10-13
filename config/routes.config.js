const { ROUTE_PREFIX } = require('../folders/utility/enum');
const userRoutes = require('../folders/routes/user.routes');
// const utilityRoutes = require('')

const configureRoutes = (app) => {
  app.use(`${ROUTE_PREFIX}/users`, userRoutes);
  // app.use(`${ROUTE_PREFIX}/utility`, utilityRoutes);
};

module.exports = configureRoutes;