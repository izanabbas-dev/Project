import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                product_name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, default: 1 },
                product_image: { type: String }
            }
        ],
        totalAmount: { 
            type: Number, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
            default: "Pending" 
        },
        shippingAddress: { 
            type: String, 
            required: true 
        }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
