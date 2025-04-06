import jwt from "jsonwebtoken";
import { config } from "dotenv";
import UserModel from "../models/user.js";
import generateVerificationCode from "../service/verificationCode.js";
import LoginCode from "../models/verification.js";
import sendLoginVerificationCode from "../service/verification.js";

config();

const login = async (req, res) => {
  try {
    const { email, password, device = "mobile" } = req.body;

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

    // for mobile users, grant access immediately
    if (device === "mobile") {
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
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
      });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const sendVerificationCode = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with the provided email." });
    }

    const existingCode = await LoginCode.findOne({
      user_id: user._id,
      status: "pending",
    });

    if (existingCode) {
      if (!existingCode.isBlocked()) {
        await LoginCode.deleteOne({ _id: existingCode._id });
      }
    }

    // Check block status
    const verify = await LoginCode.findOne({ user_id: user._id });
    if (verify && verify.isBlocked()) {
      const blockExpirationTime = verify.getBlockExpiration();
      const formattedTime = new Date(blockExpirationTime).toLocaleString();
      return res.status(403).json({
        message: `Account is blocked until ${formattedTime}. Please try again later.`,
      });
    }

    // Generate and save new code
    const verificationCode = generateVerificationCode();
    const newCode = new LoginCode({
      user_id: user._id,
      verification_code: verificationCode,
      expiration_date: new Date(Date.now() + 60 * 1000),
      status: "pending",
    });

    await newCode.save();

    // Send email
    try {
      await sendLoginVerificationCode(
        user.email,
        user.username,
        verificationCode
      );
    } catch (emailError) {
      console.error("Error sending verification code email:", emailError);
      return res
        .status(500)
        .json({ message: "Failed to send verification code." });
    }

    // Final response
    res.status(200).json({
      message: "Verification code sent successfully!",
      ...(process.env.NODE_ENV !== "production" && {
        verificationCode,
      }),
    });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginVerification = async (req, res) => {
  try {
    const { email, password, verificationCodeInput } = req.body;

    const user = await UserModel.findOne({ email }).populate({
      path: "role_id",
      select: "isMultiCampus permissions",
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with the provided email." });
    }

    const currentTime = new Date();
    const verify = await LoginCode.findOne({ user_id: user._id });

    if (!verify) {
      return res.status(400).json({
        message: "No verification record found. Please request a new code.",
      });
    }

    // Check if the user is blocked
    if (verify.isBlocked()) {
      const formattedTime = new Date(
        verify.getBlockExpiration()
      ).toLocaleString();
      return res.status(403).json({
        message: `Account is blocked until ${formattedTime}. Please try again later.`,
      });
    }

    // Block user after too many failed attempts
    if (verify.attempts >= 3) {
      const blockExpirationTime = new Date(
        currentTime.getTime() + 60 * 60 * 1000
      ); // 1 hour
      await LoginCode.updateOne(
        { user_id: user._id },
        {
          blocked_at: currentTime,
          block_expiration: blockExpirationTime,
        }
      );
      return res.status(403).json({
        message: "Too many incorrect attempts. Account is blocked for 1 hour.",
      });
    }

    // Check if code has expired
    if (verify.expiration_date < currentTime) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Compare input code
    if (verificationCodeInput !== verify.verification_code) {
      await LoginCode.updateOne(
        { user_id: user._id },
        { $inc: { attempts: 1 } }
      );
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Successful verification
    await LoginCode.updateOne(
      { user_id: user._id },
      {
        verification_code: "",
        attempts: 0,
        status: "used",
      }
    );

    const authToken = jwt.sign(
      {
        userId: user._id,
        roleId: user.role_id._id,
        campusId: user.campus_id,
        isMultiCampus: user.role_id.isMultiCampus,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login verification error:", error);
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
      secure: true,
      sameSite: "none",
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

export {
  login,
  register,
  logout,
  validateToken,
  loginVerification,
  sendVerificationCode,
};
