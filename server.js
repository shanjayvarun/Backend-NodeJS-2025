const app = require('./app');
const http = require("http");
const logger = require('./config/logger');
const environment = require('./config/env.config');

const server = http.createServer(app);

server.listen(environment.port, () => {
  logger.info(`Server: (${environment.mode}) started on Port: ${environment.port}`);
});  
