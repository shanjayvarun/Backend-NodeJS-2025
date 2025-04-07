const app = require('./app');
const http = require("http");
const socketIo = require("socket.io");
const PORT = process.env.PORT || 3000;
const logger = require('./config/logger');
const initializeSocket = require('./config/socket');

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

initializeSocket(io);

server.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});  
