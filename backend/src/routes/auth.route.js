import express from "express";
import {
  login,
  logout,
  onboard,
  signup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { connectDB } from "../lib/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Auth route is working");
});

router.get("/ping", async (req, res) => {
  try {
    const dbRes = await connectDB();
    console.log("Database connection response:", dbRes);
    res.status(200).json({ message: "Database connection successful" });
  } catch (err) {
    console.log("Error connecting to database:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/onboarding", protectRoute, onboard);

router.get("/me", protectRoute, (req, res) => {
  console.log("User details from /me:", req.user);
  return res.status(200).json({ success: true, user: req.user });
});

export default router;
