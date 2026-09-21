import express from "express";
import checkRole from "../middlewares/checkRole.middleware.mjs";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "../controllers/product.controller.mjs";
import verifyAuthToken from "../middlewares/verifyAuthToken.middleware.mjs";
import upload from "../middlewares/upload.middleware.mjs";

const productRouter = express.Router()

productRouter.get("/", getAllProducts)
productRouter.post("/", verifyAuthToken, checkRole("admin"), upload.single("product_img"), createProduct)

productRouter.get("/:id", getSingleProduct)
productRouter.put("/:id", verifyAuthToken, checkRole("admin"), updateProduct )
productRouter.delete("/:id", verifyAuthToken, checkRole("admin"), deleteProduct )
export default productRouter