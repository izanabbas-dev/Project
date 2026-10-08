import asyncHandler from "express-async-handler";
import User from "../models/user.model.mjs";

const getAllUsers = asyncHandler(async (request, response) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    const userCount = await User.countDocuments();

    return response.status(200).json({
        message: "All users",
        success: true,
        userCount,
        users
    });
});

export { getAllUsers };
