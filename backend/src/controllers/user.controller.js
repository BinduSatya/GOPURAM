import User from "../models/User.model.js";
import FriendRequest from "../models/FriendRequest.model.js";
import TripMemory from "../models/TripMemory.model.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { isOnboarded: true },
      ],
    });
    return res.status(200).json({ success: true, recommendedUsers });
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error (while getting recommended users)",
    });
  }
}

export async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .select("-password -friends") // Exclude password and friends from response
      .populate("friends", "fullName profilePic learningSkill location");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
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

    // prevent sending req to yourself
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

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user",
      });
    }

    // check if a req already exists
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
        .status(404)
        .json({ success: false, message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this request",
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(FriendRequest.sender, {
      $addToSet: { friends: FriendRequest.recipient },
    });

    await User.findByIdAndUpdate(FriendRequest.recipient, {
      $addToSet: { friends: FriendRequest.sender },
    });

    res.status(200).json({ success: true, message: "Friend request accepted" });
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

    res.status(200).json({ success: true, incomingReqs, acceptedReqs });
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
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic learningSkill location");

    res.status(200).json({ success: true, outgoingRequests });
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function postMemory(req, res) {
  try {
    console.log("Memory endpoint hit", req.body);
    const { tripName, ownerName, date, link, image } = req.body;
    if (!tripName || !ownerName || !date || !link) {
      return res
        .status(400)
        .json({ success: false, message: "Data not filled" });
    }
    const newMemory = await TripMemory.create({
      tripName,
      ownerName,
      date,
      link,
      image,
    });
    return res.status(201).json({
      success: true,
      data: newMemory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Memory not created" });
  }
}
