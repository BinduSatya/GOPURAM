import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getIncomingReqs,
  getMyFriends,
  getOutgoingFriendReqs,
  getOutgoingReqs,
  getRecommendedUsers,
  getUserById,
  sendFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/get-users", getRecommendedUsers);
router.get("/get-user/:id", getUserById);

router.get("/incoming", getIncomingReqs);
router.get("/outgoing", getOutgoingReqs);
router.get("/friends", getMyFriends);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

export default router;
