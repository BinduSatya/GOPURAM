import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages,sendMessage } from "../controllers/chat.controller.js";
// import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

// router.get("/token", protectRoute, getStreamToken);
router.get("/:id", protectRoute, getMessages);
router.post("/send-message", protectRoute, sendMessage);

export default router;
