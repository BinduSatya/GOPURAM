import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import memoryRoutes from "./routes/memories.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const server = http.createServer(app);
const userIdsToSocketIds = new Map();

const allowedOrigins = process.env.CORS.split(",").map((origin) =>
  origin.trim()
);
console.log("Allowed origins:", allowedOrigins);
app.use(cors({ origin: allowedOrigins, credentials: true }));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New User Connected", socket.id);
  socket.on("register-user", (userId) => {
    userIdsToSocketIds.set(userId, socket.id);
    console.log(`User with id: ${userId} is having a socket Id ${socket.id}`);
    socket.broadcast.emit("welcome", `New User Connected, ${socket.id}`);
  });

  socket.on("send-message", (recieverID) => {
    if (recieverID === "gopuram") {
      socket.broadcast.emit("recieved-message");
    } else {
      const targetSocketId = userIdsToSocketIds.get(recieverID);
      console.log("targetSocketId is", targetSocketId);
      if (targetSocketId) {
        socket.to(targetSocketId).emit("recieved-message");
      } else {
        console.log(`User ${recieverID} is not connected`);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`socket got disconnected ${socket.id}`);
  });
});

app.set("io", io);

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();
console.log(`__dirname: ${path.join(__dirname, "/public")}`);

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/memories", memoryRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
