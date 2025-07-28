import User from "../models/User.model.js";
import FriendRequest from "../models/FriendRequest.model.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const pendingRequests = await FriendRequest.find({
      $or: [{ recipient: currentUserId }, { sender: currentUserId }],
      status: "pending",
    }).select("sender recipient");
    console.log("pending reqs", pendingRequests);

    const requestUserIds = pendingRequests.flatMap((requ) => [
      requ.sender,
      requ.recipient,
    ]);

    console.log("requesting user ids", requestUserIds);

    const excludeIds = [
      currentUserId,
      ...currentUser.friends.map((f) => f),
      ...requestUserIds,
    ];

    const recommendedUsers = await User.find({
      _id: { $nin: excludeIds },
      isOnboarded: true,
    });

    return res.status(200).json({
      success: true,
      recommendedUsers,
    });
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error (while getting recommended users)",
    });
  }
}

export async function getIncomingReqs(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const pendingRequests = await FriendRequest.find({
      recipient: currentUserId,
      status: "pending",
    }).select("sender");
    console.log("pending reqs", pendingRequests);

    const requestUserIds = pendingRequests.flatMap((req) => [
      req.sender.toString(),
      // req.recipient.toString(),
    ]);

    return res.status(200).json({
      success: true,
      incomingreqs: requestUserIds,
    });
  } catch (error) {
    console.error("Error in getIncomingReqs controller", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error (while getting recommended users)",
    });
  }
}

export async function getOutgoingReqs(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const pendingRequests = await FriendRequest.find({
      sender: currentUserId,
      status: "pending",
    }).select("recipient");
    console.log("pending reqs", pendingRequests);

    const requestUserIds = pendingRequests.flatMap((req) => [
      req.sender.toString(),
      // req.recipient.toString(),
    ]);

    return res.status(200).json({
      success: true,
      outgoingReqs: requestUserIds,
    });
  } catch (error) {
    console.error("Error in getOutgoingReqs controller", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error (while getting recommended users)",
    });
  }
}

export async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    let user;
    console.log("backend id", userId);
    if (userId === "gopuram") {
      user = {
        fullName: "Gopuram",
      };
      return res.status(200).json({ success: true, user });
    } else {
      user = await User.findById(userId)
        .select("-password -friends") // Exclude password and friends from response
        .populate("friends", "fullName profilePic learningSkill location");
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, user });
    }
  } catch (error) {
    console.error("Error in getUserById controller", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error(while getting user by Id,getUserById)",
    });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic learningSkill");

    return res.status(200).json({ success: true, friends: user.friends });
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error (while getting my friends)" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user._id;
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res.status(400).json({
        success: false,
        message: "You can't send friend request to yourself",
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res
        .status(404)
        .json({ sucess: false, message: "Recipient not found" });
    }

    if (recipient.friends.includes(myId)) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user",
      });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "A friend request already exists between you and this user",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json({ success: true, friendRequest });
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res
        .status(200)
        .json({ success: false, message: "Friend request not found" });
    }

    if (String(friendRequest.recipient) === String(req.user._id)) {
      console.log("accepted finally");
      friendRequest.status = "accepted";
      await friendRequest.save();

      await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: { friends: friendRequest.recipient },
      });

      await User.findByIdAndUpdate(friendRequest.recipient, {
        $addToSet: { friends: friendRequest.sender },
      });
      res
        .status(200)
        .json({ success: true, message: "Friend request accepted" });
    } else {
      console.log("rejedcted finally");
      return res.status(200).json({
        success: false,
        message: "You are not authorized to accept this request",
      });
    }
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({
      message: "Internal Server Error (while accepting friend request)",
    });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending",
    }).populate("sender", "fullName profilePic learningSkill location");
    const acceptedReqs = await FriendRequest.find({
      sender: req.user._id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic learningSkill location");
    res
      .status(200)
      .json({ success: true, message: { incomingReqs, acceptedReqs } });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({
      message: "Internal Server Error (while getting friend request)",
    });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate("recipient", "fullName profilePic learningSkill location");
    res.status(200).json({ success: true, outgoingRequests });
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
