import cloudinary from "../lib/cloudinary.js";
import GopuramMessage from "../models/GopuramMessage.model.js";
import Message from "../models/Message.model.js";

export const getMessages = async (req, res) => {
  try {
    let users, senderId, receiverId, messages;
    const chatId = req.params.id;
    console.log("getting Messages in controller", chatId);
    users = chatId.split("&");
    senderId = users[0];
    receiverId = users[1];
    console.log("getting Id's of users are", senderId, " ", receiverId);

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "Sender or receiver not found" });
    }
    if (receiverId == "gopuram") {
      messages = await GopuramMessage.find().sort({ createdAt: 1 });
    } else {
      messages = await Message.find({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ createdAt: 1 });
    }
    console.log("messages are", messages);

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error (While getting messages)",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, messageText, imageFile } = req.body;

    console.log("came to backend", req.body);

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "Sender or receiver not found" });
    }
    let imageUrl = "";
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        {
          folder: "gopuram",
        }
      );
      imageUrl = uploadResponse.secure_url;
      console.log("Image uploaded successfully:", imageUrl);
    }

    let newMessage;
    if (receiverId === "gopuram") {
      newMessage = await GopuramMessage.create({
        senderId: senderId,
        text: messageText,
        image: imageUrl,
      });
    } else {
      newMessage = await Message.create({
        senderId: senderId,
        receiverId: receiverId,
        text: messageText,
        image: imageUrl,
      });
    }
    return res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Image upload failed" });
  }
};

export const getGopuramMessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    console.log("getting Id's of gopuram message sent user is", senderId);

    if (!senderId) {
      return res
        .status(400)
        .json({ success: false, message: "Sender not found" });
    }
    const messages = await GopuramMessage.find().sort({ createdAt: 1 });
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(200).json({
      success: false,
      message: "Internal Server Error (While getting Gopuram messages)",
    });
  }
};

export const sendGopuramMessage = async (req, res) => {
  try {
    const { senderId, messageText, imageFile } = req.body;

    console.log("came to gopuram backend", req.body);

    if (!senderId) {
      return res
        .status(400)
        .json({ success: false, message: "Sender or receiver not found" });
    }
    let imageUrl = "";
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        {
          folder: "gopuram",
        }
      );
      imageUrl = uploadResponse.secure_url;
      console.log("Image uploaded successfully:", imageUrl);
    }

    const newGopuramMessage = await GopuramMessage.create({
      senderId: senderId,
      text: messageText,
      image: imageUrl,
    });
    return res.status(200).json({ success: true, message: newGopuramMessage });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(200).json({ message: "Image upload failed" });
  }
};
