const app = require('./app');
const http = require("http");
const socketIo = require("socket.io");
const PORT = process.env.PORT || 3000;
const logger = require('./config/logger');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ chatId }) => {
    socket.join(chatId);
  });
  socket.on("sendMessage", (messageData) => {
    io.to(messageData.chatId).emit("receiveMessage", messageData);
  });
  socket.on("disconnect", () => {
    logger.info('Socket Disconnected')
  });
});

server.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});  
