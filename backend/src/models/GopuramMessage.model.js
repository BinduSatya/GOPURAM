import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

const GopuramMessage = mongoose.model("Group", groupSchema);
export default GopuramMessage;
