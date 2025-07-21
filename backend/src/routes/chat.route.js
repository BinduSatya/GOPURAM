import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/chat.controller.js";
// import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

// router.get("/token", protectRoute, getStreamToken);
router.use(protectRoute);
router.get("/:id", getMessages);
router.post("/send-message", sendMessage);
router.get("/get-messages", getMessages);

export default router;
