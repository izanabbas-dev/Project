import { Router } from "express";
import { getDashboardStats } from "../controllers/stats.controller.mjs";
import verifyAuthToken from "../middlewares/verifyAuthToken.middleware.mjs";
import checkRole from "../middlewares/checkRole.middleware.mjs";

const statsRouter = Router();

statsRouter.use(verifyAuthToken);
statsRouter.get("/", checkRole("admin"), getDashboardStats);

export default statsRouter;
