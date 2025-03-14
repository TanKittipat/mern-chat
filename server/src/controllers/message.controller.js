import { UserModel } from "../models/user.model.js";
import { MessageModel } from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await UserModel.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error while getting online users!",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver id is required!" });
    }
    const senderId = req.user._id;
    const { text, image } = req.body;

    const uploadResponse = await cloudinary.uploader.upload(image);
    if (!uploadResponse) {
      return res.status(400).json({ message: "Image upload failed!" });
    }

    const imageUrl = uploadResponse.secure_url;

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    // real-time message sending
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error while sending message!",
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChat } = req.params;
    const myId = req.user._id;

    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChat },
        { senderId: userToChat, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error while getting message!",
    });
  }
};
