import express from "express"
import "dotenv/config"
import cors from "cors"
import morgan from "morgan"
import connectDb from "./config/db.config.mjs"
import authRouter from "./routes/auth.route.mjs"
import cookieParser from "cookie-parser"
import categoryRouter from "./routes/category.route.mjs"

const app = express()
const port = process.env.PORT

connectDb()
app.use(express.json())

app.use(cors())
app.use(morgan("tiny"))
app.use(cookieParser())


app.use("/api/auth", authRouter)
app.use("/api/categories", categoryRouter)

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`)
})