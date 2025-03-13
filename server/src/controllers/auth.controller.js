import { generateToken } from "../lib/utils.js";
import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please fill all required fields!" });
  }
  try {
    const user = await UserModel.findOne({ email });
    console.log(user);

    if (user) {
      return res.status(400).json({ message: "This email is already used!" });
    }
    const salt = await bcrypt.genSalt(9);
    const hashedPass = await bcrypt.hash(password, salt);
    console.log("salt", salt, "\nhashed", hashedPass);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPass,
    });
    console.log(newUser);

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      });
    } else {
      res.status(400).json({ message: "Invalid user data!" });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "Internal server error while registering new user!" || error.message,
    });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please fill all required fields!" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Password is not matched!" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Internal server error while registering new user!" || error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while logging in user!" || error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    // Middleware needed
    const userId = req.user._id;

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required!" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePicture);
    if (!uploadResponse) {
      res
        .status(500)
        .json({ message: "Error while updating profile picture!" });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        profilePicture: uploadResponse.secure_url,
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res
        .status(500)
        .json({ message: "Error while updating profile picture!" });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "Internal server error while updating profile picture!" ||
        error.message,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while checking auth!" || error.message,
    });
  }
};
