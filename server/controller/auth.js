import jwt from "jsonwebtoken";
import { config } from "dotenv";
import UserModel from "../models/user.js";

config();

const login = async (req, res) => {
  try {
    const { email, password, rememberMe, device = "mobile" } = req.body;

    const user = await UserModel.findOne({ email }).populate({
      path: "role_id",
      select: "isMultiCampus permissions",
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with the provided email." });
    }

    // Validate password (use a hashed password comparison in production)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check account status
    if (user.status === "pending") {
      return res.status(401).json({
        message:
          "Your account is pending verification. Please check your email for a verification link.",
      });
    }

    if (user.status === "inactive") {
      return res.status(401).json({
        message:
          "Your account is inactive. Please contact support for assistance.",
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        message:
          "Your account has been blocked due to policy violations. Contact support for more details.",
      });
    }

    if (device === "web" && user.role_id.permissions.length === 0) {
      return res.status(403).json({
        message:
          "Oops! It seems like you don't have access to this page. Please contact support for further assistance.",
      });
    }

    // Ensure role_id is populated and exists
    if (!user.role_id) {
      return res.status(400).json({
        message: "User role not assigned or role details missing.",
      });
    }

    // Generate JWT token
    const authToken = jwt.sign(
      {
        userId: user._id,
        roleId: user.role_id._id, // Use the populated role's ID
        campusId: user.campus_id,
        isMultiCampus: user.role_id.isMultiCampus,
      },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "30d" : "1d" }
    );

    // Set authToken in cookies
    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days or 1 day
    });

    res.status(200).json({ message: "Login successful", token: authToken });
  } catch (error) {
    console.error("Login error:", error);
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

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Validates if the token is still valid.
 */
const validateToken = (req, res) => {
  try {
    res.status(200).json({ message: "Token is valid", valid: true });
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { login, register, logout, validateToken };
