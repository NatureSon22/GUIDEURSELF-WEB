import express from "express";
import CampusProgramType from "../models/CampusProgramType.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.get("/campusprogramtypes", async (req, res) => {
  try {
    const programTypes = await CampusProgramType.find();
    res.json(programTypes);
  } catch (error) {
    console.error("Failed to fetch program types", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
