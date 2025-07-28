import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GopuramMessage",
      required: false,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const GopuramMessage = mongoose.model("GopuramMessage", groupSchema);
export default GopuramMessage;
