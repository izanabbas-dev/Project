import asyncHandler from "express-async-handler";
import Product from "../models/product.model.mjs";
import Category from "../models/category.model.mjs";
import User from "../models/user.model.mjs";
import Order from "../models/order.model.mjs";

const getDashboardStats = asyncHandler(async (request, response) => {
    try {
        const [productCount, categoryCount, userCount, orderCount] = await Promise.all([
            Product.countDocuments(),
            Category.countDocuments(),
            User.countDocuments({ role: { $ne: "admin" } }).catch(() => User.countDocuments()),
            Order.countDocuments().catch(() => 0)
        ]);

        const totalUserCount = await User.countDocuments();

        return response.status(200).json({
            message: "Dashboard statistics fetched successfully",
            success: true,
            stats: {
                products: productCount,
                categories: categoryCount,
                users: userCount || totalUserCount,
                orders: orderCount
            }
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Failed to fetch dashboard statistics",
            success: false
        });
    }
});

export { getDashboardStats };
