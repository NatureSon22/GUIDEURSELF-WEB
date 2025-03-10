import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  createSession,
  getSessions,
  logout,
  logoutAll,
} from "../controller/session.js";

const sessionRouter = Router();

sessionRouter.get("/", verifyToken, getSessions);
sessionRouter.post("/create-session", verifyToken, createSession);
sessionRouter.post("/logout", verifyToken, logout);
sessionRouter.post("/logout-all", verifyToken, logoutAll);

export default sessionRouter;
