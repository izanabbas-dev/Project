import express from "express"
import "dotenv/config"
import cors from "cors"
import morgan from "morgan"
import connectDb from "./config/db.config.mjs"
import authRouter from "./routes/auth.route.mjs"
import cookieParser from "cookie-parser"
import categoryRouter from "./routes/category.route.mjs"
import productRouter from "./routes/product.route.mjs"
import statsRouter from "./routes/stats.route.mjs"
import orderRouter from "./routes/order.route.mjs"
import userRouter from "./routes/user.route.mjs"
import upload from "./middlewares/upload.middleware.mjs"
import upload_on_cloudinary from "./utils/cloudinary.utils.mjs"

const app = express()
const port = process.env.PORT || 3000

connectDb()
app.use(express.json())

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
}))
app.use(morgan("tiny"))
app.use(cookieParser())

app.post("/uploads", upload.single("file"), async(request, response) => {
    try {
        if (!request.file) {
            return response.status(400).json({ message: "No file provided" });
        }
        console.log("File: ", request.file)
        const cloud_img = await upload_on_cloudinary(request.file.path)
        console.log("CLOUD IMG: ", cloud_img)

        return response.status(200).json({ 
            message: "UPLOADED", 
            secure_url: cloud_img.secure_url, 
            public_id: cloud_img.public_id
        })
    } catch (error) {
        return response.status(500).json({ message: error.message })
    }
})

app.use("/api/auth", authRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/products", productRouter)
app.use("/api/stats", statsRouter)
app.use("/api/orders", orderRouter)
app.use("/api/users", userRouter)

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`)
})
