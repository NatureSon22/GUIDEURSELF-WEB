import jwt from "jsonwebtoken";
import { config } from "dotenv";
import UserModel from "../models/user.js";

config();

const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with the provided email." });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "active") {
      return res.status(401).json({
        message: "Account is not active. Please wait for verification",
      });
    }

    const authToken = jwt.sign(
      {
        userId: user._id,
        roleId: user.role_id,
        campusId: user.campus_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: rememberMe ? "30d" : "1d",
      }
    );

    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new UserModel({ email, password });
    await user.save();

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const validateToken = (req, res) => {
  try {
    res.status(200).json({
      message: "Token is valid",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { login, register, logout, validateToken };
