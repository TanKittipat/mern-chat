import { UserModel } from "../models/user.model.js";

export const checkFriendShip = async (req, res, next) => {
  const { id: friendId } = req.params;
  const userId = req.user._id;

  try {
    const user = await UserModel.findById(userId);
    if (!user.friends.includes(friendId)) {
      return res
        .status(403)
        .json({ message: "You aren't friend with this user!" });
    }
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while checking friendship!" });
  }
};
