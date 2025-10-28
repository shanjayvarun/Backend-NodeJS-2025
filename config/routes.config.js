const { ROUTE_PREFIX } = require('../folders/utility/enum');
const userRoutes = require('../folders/routes/user.routes');
const utilityRoutes = require('../folders/routes/utility.routes');
const companyRoutes = require('../folders/routes/companies.routes');
const leadRoutes = require('../folders/routes/leads.routes');
const dealRoutes = require('../folders/routes/deals.routes');

const configureRoutes = (app) => {
  app.use(`${ROUTE_PREFIX}/users`, userRoutes);
  app.use(`${ROUTE_PREFIX}/utility`, utilityRoutes);
  app.use(`${ROUTE_PREFIX}/companies`, companyRoutes);
  app.use(`${ROUTE_PREFIX}/leads`, leadRoutes);
  app.use(`${ROUTE_PREFIX}/deals`, dealRoutes);
};

module.exports = configureRoutes;