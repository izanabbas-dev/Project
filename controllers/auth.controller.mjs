import asyncHanlder from "express-async-handler"
import User from "../models/user.model.mjs"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const register = asyncHanlder(async(request, response) => {
    const { name, email, password, address, workphone_no, cellphone_no, dob } = request.body

    if(!name || !email || !password || !address || !workphone_no || !cellphone_no || !dob){
        response.status(400).json({ message: `All fields are required.` })
    }

    const userExists = await User.findOne({ email })

    if(userExists){
        return response.status(400).json({ 
            message: `User already registered.`,
            success: false
        })
    }

    const hashPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
        name, email, password: hashPassword, address, workphone_no, cellphone_no, dob
    })
    
    response.status(201).json({ 
        message: `User registered.`, 
        success: true, 
        user 
    })
})

const login = asyncHanlder(async(request, response) => {
    const { email, password } = request.body

    if(!email || !password){
        return response.status(400).json({
            message: `Email and password is required`,
            success: false
        })
    }

    const user = await User.findOne({ email })

    if(!user){
        return response.status(404).json({
            message: `User not registered.`,
            success: false
        })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if(!validPassword){
        return response.status(401).json({
            message: `Invalid Password.`,
            success: false
        })
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" })
    
    response.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 1 * 60 * 60 * 3600
    })

    response.status(200).json({ 
            message: `User login.`, 
            
            success: true,
            name: user.name, 
            email: user.email,
            token 
        })    
})

const logout = asyncHanlder(async(request, response) => {
    response.clearCookie("token")
    response.status(200).json({ message: `User logout.` })    
})

const profile = asyncHanlder(async(request, response) => {
    const profile = await User.findById(request.user._id).select("-password")
    response.status(200).json({ message: `User profile.`, profile })    
    
})

export {
    register, login, logout, profile
}