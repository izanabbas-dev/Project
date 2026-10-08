import { Router } from "express";
import { createOrder, getAllOrders, getMyOrders, updateOrderStatus } from "../controllers/order.controller.mjs";
import verifyAuthToken from "../middlewares/verifyAuthToken.middleware.mjs";
import checkRole from "../middlewares/checkRole.middleware.mjs";

const orderRouter = Router();

orderRouter.use(verifyAuthToken);

orderRouter.get("/my-orders", checkRole("admin", "customer"), getMyOrders);
orderRouter.get("/", checkRole("admin"), getAllOrders);
orderRouter.post("/", checkRole("admin", "customer"), createOrder);
orderRouter.put("/:id/status", checkRole("admin"), updateOrderStatus);

export default orderRouter;
