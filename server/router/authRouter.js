import { Router } from "express";
import { login, register, validateToken } from "../controller/auth.js";
import verifyToken from "../middleware/verifyToken.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/validate-token", verifyToken, validateToken);

export default authRouter;
