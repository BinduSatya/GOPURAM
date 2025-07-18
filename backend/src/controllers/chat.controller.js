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
import Message from "../models/Messge.model.js";

export const getMessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "Sender or receiver not found" });
    }
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });
    return res.status(200).json({ sucess: true, messages });
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
    const { image, text } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;
    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "Sender or receiver not found" });
    }
    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "gopuram",
      });
      imageUrl = uploadResponse.secure_url;
      console.log("Image uploaded successfully:", imageUrl);
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        text,
        image: imageUrl,
      });
      // real-time message sending logic here
    }
    return res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Image upload failed" });
  }
};
