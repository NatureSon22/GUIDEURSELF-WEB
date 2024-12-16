import { Router } from "express";
import { login } from "../controller/auth.js";
import { register } from "../controller/auth.js";

const authRouter = Router();

authRouter.get("/login", login);
authRouter.post("/register", register);

export default authRouter;
