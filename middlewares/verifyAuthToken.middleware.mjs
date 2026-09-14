import jwt from "jsonwebtoken"
import User from "../models/user.model.mjs"


const verifyAuthToken = async(request, response, next) => {
    try {
        const token = request.cookies.token
        // console.log("Token: ", token)

        if(!token){
            return response.status(401).json({ message: `Token not found.` })
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY)
        // console.log("Decode: ", decode)

        request.user = await User.findById(decode._id) 
        // console.log("Requested User Profile: ", request.user)

        next()

    } catch (error) {
        response.status(500).json({ message: error.message})
    }
}

export default verifyAuthToken