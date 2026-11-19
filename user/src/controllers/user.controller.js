import { config } from "../config/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userModel from "../models/user.model.js";
import redisClient from "../config/redis.js";
import { HttpStatusCode } from "../constants/HttpStatusCode.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await userModel.findOne({ email: email });

    if (user) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token);

    delete newUser._doc.password;

    res
      .status(HttpStatusCode.SUCCESS)
      .json({ message: "User created successfully", newUser, token });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email }).select("+password");

    if (!user) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Invalid Email or Password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);

    delete user._doc.password;

    res
      .status(HttpStatusCode.SUCCESS)
      .json({ message: "Login successful", user, token });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    const fetchedUser = await userModel.findById(user.id);

    res.status(HttpStatusCode.SUCCESS).json({
      message: "User profile fetched successfully",
      user: fetchedUser,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "No token found",
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const remainingTime = decoded.exp - Math.floor(Date.now() / 1000);

    if (remainingTime > 0) {
      await redisClient.set(`blacklist:${token}`, "revoked", {
        EX: remainingTime,
      });
    }

    res.clearCookie("token");

    return res.status(HttpStatusCode.SUCCESS).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error.message);

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Unable to complete logout",
    });
  }
};

export { registerUser, loginUser, getUserProfile, logoutUser };
