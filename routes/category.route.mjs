import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from "../controllers/category.controller.mjs";
import verifyAuthToken from "../middlewares/verifyAuthToken.middleware.mjs";
import checkRole from "../middlewares/checkRole.middleware.mjs";

const categoryRouter = Router()

categoryRouter.use(verifyAuthToken)

categoryRouter.get('/', checkRole("admin", "customer"), getAllCategories)
categoryRouter.post('/', checkRole("admin"), createCategory)

categoryRouter.get('/:id', checkRole("admin", "customer"), getSingleCategory)
categoryRouter.put('/:id', checkRole("admin"), updateCategory)
categoryRouter.delete('/:id', checkRole("admin"), deleteCategory)

export default categoryRouter