import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model("Message", messageSchema);
