import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import {
  //   getMemory,
  postMemory,
  getAllMemory,
} from "../controllers/memories.controller.js";
const router = express.Router();

router.use(protectRoute);
router.get("/all", getAllMemory);
// router.get("/memory/:id", getMemory);
router.post("/post-memory", postMemory);

export default router;
