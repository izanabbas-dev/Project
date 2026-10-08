import asyncHandler from "express-async-handler";
import Product from "../models/product.model.mjs";
import upload_on_cloudinary from "../utils/cloudinary.utils.mjs";
import delete_from_cloudinary from "../utils/delete_cloudinary_img.utils.mjs";


const getAllProducts = asyncHandler(async (request, response) => {
    const products = await Product.find().populate("category", "category_name").sort({ createdAt: -1 });
    const productCount = await Product.countDocuments();

    return response.status(200).json({
        message: `all product`,
        success: true,
        productCount,
        products
    });
});

const createProduct = asyncHandler(async (request, response) => {
    const { product_name, price, category } = request.body;

    if (!product_name || !price || !category) {
        return response.status(400).json({
            message: `Please provide product_name, price, category.`,
            success: false
        });
    }

    if (!request.file) {
        return response.status(400).json({
            message: `Product Image is required.`,
            success: false
        });
    }

    const product_img = await upload_on_cloudinary(request.file.path);

    const product = await Product.create({ 
        product_name, 
        price: Number(price),
        category,  
        product_image: product_img.secure_url,
        product_image_public_id: product_img.public_id
    });

    const populatedProduct = await Product.findById(product._id).populate("category", "category_name");

    return response.status(201).json({
        message: `added new product`,
        success: true,
        product: populatedProduct || product
    });
});


const getSingleProduct = asyncHandler(async (request, response) => {
    const { id } = request.params;

    const product = await Product.findById(id).populate("category", "category_name");

    if (!product) {
        return response.status(404).json({
            message: `product does not exists.`,
            success: false
        });
    }

    return response.status(200).json({
        message: `single product`,
        success: true,
        product
    });
});


const updateProduct = asyncHandler(async (request, response) => {
    const { id } = request.params;

    const product = await Product.findById(id);

    if (!product) {
        return response.status(404).json({
            message: `product does not exists.`,
            success: false
        });
    }

    const updateData = { ...request.body };

    if (updateData.price) {
        updateData.price = Number(updateData.price);
    }

    if (request.file) {
        const product_img = await upload_on_cloudinary(request.file.path);
        if (product.product_image_public_id) {
            try {
                await delete_from_cloudinary(product.product_image_public_id);
            } catch (err) {
                console.error("Cloudinary delete error on update:", err.message);
            }
        }
        updateData.product_image = product_img.secure_url;
        updateData.product_image_public_id = product_img.public_id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).populate("category", "category_name");

    return response.status(200).json({
        message: `update product`,
        success: true,
        updatedProduct
    });
});

const deleteProduct = asyncHandler(async (request, response) => {
    const { id } = request.params;

    const product = await Product.findById(id);

    if (!product) {
        return response.status(404).json({
            message: `product does not exists.`,
            success: false
        });
    }

    if (product.product_image_public_id) {
        try {
            await delete_from_cloudinary(product.product_image_public_id);
        } catch (err) {
            console.error("Cloudinary delete error on product delete:", err.message);
        }
    }

    await Product.findByIdAndDelete(id);
    
    return response.status(200).json({
        message: `delete product`,
        success: true
    });
});

export {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct
};
