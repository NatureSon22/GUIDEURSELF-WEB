import { Router } from "express";
import {
  login,
  register,
  validateToken,
  logout,
  sendVerificationCode,
  loginVerification,
} from "../controller/auth.js";
import verifyToken from "../middleware/verifyToken.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/register", register);
authRouter.post("/send-verification-code", sendVerificationCode);
authRouter.post("/verify-code", loginVerification);
authRouter.get("/validate-token", verifyToken, validateToken);

export default authRouter;
