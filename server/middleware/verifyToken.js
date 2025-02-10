import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const publicRoutes = [/^\/api\/general\/\w+$/]; // Matches "/api/general/:id"

const verifyToken = (req, res, next) => {
  if (publicRoutes.some((route) => route.test(req.originalUrl))) {
    return next(); // Skip authentication for this route
  }

  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId,
      campusId: decoded.campusId,
      isMultiCampus: decoded.isMultiCampus
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
