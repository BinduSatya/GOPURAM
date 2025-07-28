import express from "express";
import { upload } from "../middleware/multer.file.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  sendMessage,
  getGopuramMessages,
  sendGopuramMessage,
} from "../controllers/chat.controller.js";
// import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

// router.get("/token", protectRoute, getStreamToken);
router.use(protectRoute);
router.get("/:id", getMessages);
router.post("/send-message", upload.single("imageFile"), sendMessage);
router.get("/get-messages", getMessages);
// router.post("/gopuram", sendGopuramMessage);

export default router;
