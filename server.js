const app = require('./app');
const http = require("http");
const socketIo = require("socket.io");
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*", // Update this with your frontend domain
    methods: ["GET", "POST"]
  }
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Join a chat room
  socket.on("joinRoom", ({ chatId }) => {
    socket.join(chatId);
    console.log(`User joined room: ${chatId}`);
  });

  // Listen for new messages
  socket.on("sendMessage", (messageData) => {
    console.log("Message received:", messageData);

    // Broadcast the message to the room
    io.to(messageData.chatId).emit("receiveMessage", messageData);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});  
