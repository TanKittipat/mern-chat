import { UserModel } from "../models/user.model.js";

export const addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;
    console.log("friend:", friendId, " user:", userId);

    if (userId === friendId) {
      return res
        .status(400)
        .json({ message: "You can't add yourself as a friend!" });
    }

    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);

    if (!friend) {
      return res.status(400).json({ message: "User not found!" });
    }
    // check user already friend
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "User is already a friend!" });
    }
    // check friend req
    if (user.friendsReq.includes(friendId)) {
      user.friends.push(friendId);
      friend.friends.push(userId);
      user.friendsReq = user.friendsReq.filter(
        (id) => friendId !== id.toString()
      );
      friend.friendsReq = friend.friendsReq.filter(
        (id) => userId !== id.toString()
      );
      await user.save();
      await friend.save();
      return res.status(200).json({ message: "Friend request accepted!" });
    }
    if (!friend.friendsReq.includes(userId)) {
      friend.friendsReq.push(userId);
      await friend.save();
    }
    res.status(200).json({ message: "Friend request sent!" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while sending friend request!",
    });
  }
};

export const acceptFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;
    console.log("friend:", friendId, " user:", userId);

    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);

    if (!friend) {
      return res.status(400).json({ message: "User not found!" });
    }

    if (!user.friendsReq.includes(friendId)) {
      return res
        .status(404)
        .json({ message: "No friend request from this user!" });
    }

    user.friends.push(friendId);
    friend.friends.push(userId);
    user.friendsReq = user.friendsReq.filter(
      (id) => friendId !== id.toString()
    );
    friend.friendsReq = friend.friendsReq.filter(
      (id) => userId !== id.toString()
    );
    await user.save();
    await friend.save();
    return res.status(200).json({ message: "Friend request accepted!" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while accepting friend request!",
    });
  }
};
