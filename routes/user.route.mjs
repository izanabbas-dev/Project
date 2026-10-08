import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller.mjs";
import verifyAuthToken from "../middlewares/verifyAuthToken.middleware.mjs";
import checkRole from "../middlewares/checkRole.middleware.mjs";

const userRouter = Router();

userRouter.use(verifyAuthToken);
userRouter.get("/", checkRole("admin"), getAllUsers);

export default userRouter;
