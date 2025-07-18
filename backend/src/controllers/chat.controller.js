// import { generateStreamToken } from "../lib/stream.js";

// export async function getStreamToken(req, res) {
//   try {
//     const token = generateStreamToken(req.user.id);

//     res.status(200).json({ token });
//   } catch (error) {
//     console.log("Error in getStreamToken controller:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.model.js";

export const getMessages = async (req, res) => {
  try {
    const chatId = req.params.id;
    console.log("chatId", chatId);
    const users = chatId.split("&");
    const senderId = users[0];
    const receiverId = users[1];
    console.log("Id's of users are", senderId, receiverId);

    // return users;
    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "Sender or receiver not found" });
    }
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });
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
    if (imageFile) {
      const uploadResponse = await cloudinary.uploader.upload(imageFile, {
        folder: "gopuram",
      });
      imageUrl = uploadResponse.secure_url;
      console.log("Image uploaded successfully:", imageUrl);
    }
    const newMessage = await Message.create({
      senderId: senderId,
      receiverId: receiverId,
      text: messageText,
      image: imageUrl,
    });
    // real-time message sending logic here
    return res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Image upload failed" });
  }
};
