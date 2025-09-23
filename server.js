const app = require('./app');
const http = require("http");
const PORT = process.env.PORT || 3000;
const logger = require('./config/logger');

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});  
