import express, { response } from "express"
import "dotenv/config"
import cors from "cors"
import morgan from "morgan"
import connectDb from "./config/db.config.mjs"
import authRouter from "./routes/auth.route.mjs"
import cookieParser from "cookie-parser"
import categoryRouter from "./routes/category.route.mjs"
import productRouter from "./routes/product.route.mjs"
import upload from "./middlewares/upload.middleware.mjs"
import upload_on_cloudinary from "./utils/cloudinary.utlis.mjs"

const app = express()
const port = process.env.PORT

connectDb()
app.use(express.json())

app.use(cors())
app.use(morgan("tiny"))
app.use(cookieParser())

app.post("/uploads", upload.single("file"), async(request, response) => {
    console.log("File: ", request.file)
    const cloud_img = await upload_on_cloudinary(request.file.path)
    console.log("CLOUD IMG: ", cloud_img)

    return response.status(200).json({ 
        message: "UPLOADED", 
        secure_url: cloud_img.secure_url, 
        public_id: cloud_img.public_id 
    })
})
    

app.use("/api/auth", authRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/products", productRouter)

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`)
})