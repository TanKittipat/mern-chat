import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendsReq: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const UserModel = mongoose.model("User", userSchema);
