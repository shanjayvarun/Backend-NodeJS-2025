const logger = require('../config/logger');

const initializeSocket = (io) => {
  const users = {};

  io.on("connection", (socket) => {
    logger.info(`✅ Client connected: ${socket.id}`);

    socket.on("new-user", (user) => {
      users.clientName = user;
      users.socketID = socket.id;
    });

    socket.on("send-message", (message) => {
      socket.broadcast.emit("receive-message", { 
        message: message, 
        user: users
      });
      logger.info(`Message Sent from Server to Client: ${message}`);
    });

    socket.on("disconnect", () => {
      delete users.socketID;
      logger.info(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;