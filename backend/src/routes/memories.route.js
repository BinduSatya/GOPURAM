import express from "express";
import { upload } from "../middleware/multer.file.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  postMemory,
  getAllMemory,
} from "../controllers/memories.controller.js";

const router = express.Router();
router.use(protectRoute);
router.get("/all", getAllMemory);
router.post("/post-memory", upload.single("image"), postMemory);

export default router;
