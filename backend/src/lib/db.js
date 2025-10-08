import mongoose from "mongoose";

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const cached = global.mongoose;

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`✅ MongoDB Connected: ${cached.conn.connection.host}`);
    return `✅ MongoDB Connected: ${cached.conn.connection.host}`;
  } catch (err) {
    cached.conn = null;
    console.error("❌ MongoDB connection error:", err.message);
    return `❌ MongoDB connection error: ${err.message}`;
  }
};
