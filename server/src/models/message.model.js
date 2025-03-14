import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model("Message", messageSchema);
