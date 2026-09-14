import { Router } from "express";
import { login, logout, profile, register } from "../controllers/auth.controller.mjs";
import verifyAuthToken from "../middlewares/verifyAuthToken.middleware.mjs";

const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/profile', verifyAuthToken, profile)
// authRouter.get('/profile', verifyAuthToken, checkRole("admin", "customer"), profile)



export default authRouter