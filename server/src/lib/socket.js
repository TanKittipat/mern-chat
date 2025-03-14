import { Server } from "socket.io";
import express from "express";
import http from "http";
import "dotenv/config";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: [process.env.BASE_URL] },
});

const userSocketMap = {};
// {userId:socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("friendReqSent", (friendId) => {
    const receiverSocketId = getReceiverSocketId(friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendReqReceived", userId);
    }
  });

  socket.on("friendReqAccepted", (friendId) => {
    const receiverSocketId = getReceiverSocketId(friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendReqAccepted", userId);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected!", socket.id);
    delete userSocketMap[userId];
    console.log("UserSocketMap", userSocketMap);
  });
});

export { app, server, io };
