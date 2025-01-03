import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const verifyToken = (req, res, next) => {
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default verifyToken;
