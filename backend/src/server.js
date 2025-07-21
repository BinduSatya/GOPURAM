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

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New User Connected", socket.id);
  io.emit("welcome", `New User Connected, ${socket.id}`);
  socket.on("send-message", (msgDetails) => {
    console.log(
      `messge data is ${msgDetails.senderId}, ${msgDetails.messageText}`
    );
    socket.broadcast.emit("recieved-message");
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

const allowedOrigins = ["http://localhost:5173", "https://gopuram.vercel.app"];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/memories", memoryRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
