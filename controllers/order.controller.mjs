import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/order.model.mjs";

const getAllOrders = asyncHandler(async (request, response) => {
    const orders = await Order.find()
        .populate("user", "name email")
        .populate("items.product", "product_name price")
        .sort({ createdAt: -1 });

    const orderCount = await Order.countDocuments();

    return response.status(200).json({
        message: "All orders",
        success: true,
        orderCount,
        orders
    });
});

const getMyOrders = asyncHandler(async (request, response) => {
    const orders = await Order.find({ user: request.user._id })
        .populate("items.product", "product_name price product_image")
        .sort({ createdAt: -1 });

    return response.status(200).json({
        message: "Customer orders fetched",
        success: true,
        orders
    });
});

const createOrder = asyncHandler(async (request, response) => {
    const { items, totalAmount, shippingAddress } = request.body;

    if (!items || !items.length || !totalAmount || !shippingAddress) {
        return response.status(400).json({
            message: "Missing order details (items, totalAmount, shippingAddress)",
            success: false
        });
    }

    // Sanitize items so invalid or mock product IDs don't crash mongoose ObjectId casting
    const sanitizedItems = items.map((item) => ({
        product: mongoose.Types.ObjectId.isValid(item.product || item._id)
            ? (item.product || item._id)
            : undefined,
        product_name: item.product_name,
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        product_image: item.product_image || ""
    }));

    const order = await Order.create({
        user: request.user._id,
        items: sanitizedItems,
        totalAmount: Number(totalAmount),
        shippingAddress: shippingAddress.trim(),
        status: "Pending"
    });

    return response.status(201).json({
        message: "Order placed successfully",
        success: true,
        order
    });
});

const updateOrderStatus = asyncHandler(async (request, response) => {
    const { id } = request.params;
    const { status } = request.body;

    const order = await Order.findById(id);
    if (!order) {
        return response.status(404).json({
            message: "Order not found",
            success: false
        });
    }

    if (status) {
        order.status = status;
    }
    await order.save();

    return response.status(200).json({
        message: "Order updated successfully",
        success: true,
        order
    });
});

export { getAllOrders, getMyOrders, createOrder, updateOrderStatus };
