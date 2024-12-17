import { Router } from "express";
import { login, register, validateToken, logout } from "../controller/auth.js";
import verifyToken from "../middleware/verifyToken.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/register", register);
authRouter.get("/validate-token", verifyToken, validateToken);

export default authRouter;
