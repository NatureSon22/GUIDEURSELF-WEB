import { Router } from "express";
import { getAllUsers } from "../controller/accounts.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);

export default userRouter;
