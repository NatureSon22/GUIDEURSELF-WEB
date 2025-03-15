import { Router } from "express";
import multer from "multer";
import {
  addFeedback,
  getAllFeedback,
  getFeedback,
  getEveryFeedback
  getTotalFeedback,
} from "../controller/feedback.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();
const upload = multer();

router.get("/", verifyToken, getFeedback);
router.get("/all-feedback", verifyToken, getAllFeedback);
router.get("/every-feedback", verifyToken, getEveryFeedback);
router.get("/total-feedback", verifyToken, getTotalFeedback);
router.post("/add-feedback", verifyToken, upload.none(), addFeedback);

export default router;
