import User from "../models/user.model.mjs"


const checkRole = (...role) => {
    return async(request, response, next) => {
        const roleExists = await User.findOne({ role: request.user.role })

        if(!roleExists){
            return response.status(401).json({ message: 'Insufficient Role' })
        }

        const user = await User.findById( roleExists._id )

        if(!role.includes(user.role)){
            return response.status(401).json({ message: 'Cannot Access with this role' })
        }

        next()
    }
}

export default checkRole

// authRouter.get('/profile', verifyAuthToken, checkRole("admin", "customer"), profile)