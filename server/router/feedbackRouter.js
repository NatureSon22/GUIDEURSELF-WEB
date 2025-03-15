import { Router } from "express";
import multer from "multer";
import {
  addFeedback,
  getAllFeedback,
  getFeedback,
  getEveryFeedback
} from "../controller/feedback.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();
const upload = multer();

router.get("/", verifyToken, getFeedback);
router.get("/all-feedback", verifyToken, getAllFeedback);
router.get("/every-feedback", verifyToken, getEveryFeedback);
router.post("/add-feedback", verifyToken, upload.none(), addFeedback);

export default router;
