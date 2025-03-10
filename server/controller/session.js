import SessionModel from "../models/session.js";
import { UAParser } from "ua-parser-js";

const getSessions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const activeSessions = await SessionModel.find({
      userId,
      isActive: true,
    }).sort({
      lastActive: -1,
    });
    const inactiveSessions = await SessionModel.find({
      userId,
      isActive: false,
    }).sort({ lastActive: -1 });

    res.status(200).json({ activeSessions, inactiveSessions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createSession = async (req, res) => {
  try {
    const { device } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.ip;
    const parser = new UAParser(req.headers["user-agent"]);
    const userAgent = parser.getResult();

    // Check if an active session exists for this user and device
    let session = await SessionModel.findOne({
      userId: req.user.userId,
      device,
      isActive: true,
    });

    if (session) {
      session.lastActive = new Date();
      await session.save();
    } else {
      session = new SessionModel({
        userId: req.user.userId,
        device,
        ip,
        userAgent,
      });
      await session.save();
    }

    res.json({ message: "Login successful", session });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user.userId;

    await SessionModel.findOneAndUpdate({ userId }, { isActive: false });

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutAll = async (req, res) => {
  try {
    const userId = req.user.userId;
    await SessionModel.updateMany({ userId }, { isActive: false });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const trackActivity = async (req, res, next) => {
  const userId = req.user.userId;
  if (userId) {
    await SessionModel.findOneAndUpdate({ userId }, { lastActive: Date.now() });
  }

  next();
};

export { getSessions, createSession, trackActivity, logout, logoutAll };
