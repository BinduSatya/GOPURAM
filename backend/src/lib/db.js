import mongoose from "mongoose";
let isConnected = false;
export const connectDB = async () => {
  if (isConnected) {
    console.log("🟢 Using existing MongoDB connection");
    // next();
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log(`✅ MongoDB Connected: ${db.connection.host}`);
    // next();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw new Error("MongoDB connection failed");
  }
};
