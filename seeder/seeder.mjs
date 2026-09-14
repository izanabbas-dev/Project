import "dotenv/config"
import connectDb from "../config/db.config.mjs"
import bcrypt from "bcryptjs"
import User from "../models/user.model.mjs"

const seeder = async () => {
    try {
        await connectDb()

        console.log("Seeder started seeding data ....")

        const admin = await User.findOne({ email: process.env.ADMIN_EMAIL })

        if(admin){
            console.log("Admin already exists in db.")
            return
        }

        const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
        await User.create({
            name: "admin",
            email: process.env.ADMIN_EMAIL,
            password: hashPassword,
            role: "admin",
            address: "Abc Street, XYZ Road",
            workphone_no: "12345678931",
            cellphone_no: "12345678931",
            dob: "2000-01-01"
        })

        console.log("ADMIN CREDENTIALS seeded succesfully...")

        process.exit(0)
    } catch (error) {
        console.log("Error in seeding: ", error.message)
    }
}

seeder()