const { ROUTE_PREFIX } = require('../folders/utility/enum');
const userRoutes = require('../folders/routes/user.routes');

const configureRoutes = (app) => {
  app.use(`${ROUTE_PREFIX}/users`, userRoutes);
};

module.exports = configureRoutes;