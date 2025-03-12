import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  createSession,
  getSessions,
  logout,
  logoutAll,
  logoutSession,
} from "../controller/session.js";

const sessionRouter = Router();

sessionRouter.get("/", verifyToken, getSessions);
sessionRouter.post("/logout-session/:sessionId", verifyToken, logoutSession);
sessionRouter.post("/create-session", verifyToken, createSession);
sessionRouter.post("/logout", verifyToken, logout);
sessionRouter.post("/logout-all", verifyToken, logoutAll);

export default sessionRouter;
