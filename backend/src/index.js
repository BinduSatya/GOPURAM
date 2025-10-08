import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import memoryRoutes from "./routes/memories.route.js";

import { connectDB } from "./lib/db.js";

const app = express();

const allowedOrigins = process.env.CORS.split(",").map((origin) =>
  origin.trim()
);
console.log("Allowed origins:", allowedOrigins);
// app.use(cors({ origin: allowedOrigins, credentials: true }));

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.send("API is running...."));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/memories", memoryRoutes);

export default app;
