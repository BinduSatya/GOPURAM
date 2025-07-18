import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserById,
  sendFriendRequest,
  postMemory,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/get-users", getRecommendedUsers);
router.get("/get-user/:id", getUserById);
router.get("/friends", getMyFriends);

router.post("/memories-form", postMemory);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

export default router;
