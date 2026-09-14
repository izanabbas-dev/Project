import mongoose from "mongoose";

const connectDb = async() => {
    const DB_NAME = "Project_DB"
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`Connected to: ${conn.connection.host}`)
        console.log(`Connected database: ${conn.connection.name}`)
    } catch (error) {
        console.log(`Error in connection: `, error.message)
    }
}

export default connectDb