import asyncHandler from "express-async-handler";
import product from "../models/product.model.mjs";
import upload_on_cloudinary from "../utils/cloudinary.utlis.mjs";

const getAllProducts = asyncHandler(async(request, response) => {
    const products = await product.find().populate("category", "category_name")
    const productCount = await Product.countDoucments()

    return response.status(200).json({
        message: `all product`,
        success: true,
        productCount,
        products
    }) 
})

const createProduct = asyncHandler(async(request, response) => {
    const { product_name, price, category } = request.body
    // const product_img = request.file.path

    if(!product_name || !price || !category){
        return response.status(400).json({
            message: `Please provide product_name, price, category`,
            success: false
        })
    }

    if(!request.file){
        return response.status(400).json({
            message: `Product Image is required.`,
            success: false
        })
    }

   const product_img = await upload_on_cloudinary(request.file.path)

    console.log("PRODUCT IMAGE: ", request.file);
    console.log("PRODUCT IMAGE: ", product_img);

    // const productExists = await product.findOne({ product_name })
    // if(productExists){
    //     return response.status(409).json({
    //         message: `product already exists.`,
    //         success: false
    //     })
    // }

    const product = await Product.create({ 
        product_name, 
        price, 
        category,
        product_image: product_img.secure_url,
        product_image_public_id: product_img.public_id
    })

    return response.status(201).json({
        message: `added new product`,
        success: true,
        product
    })
})

const getSingleProduct = asyncHandler(async(request, response) => {
    const { id } = request.params

    const product = await product.findById( id ).populate("category", "category_name")

    if(!product){
        return response.status(404).json({
            message: `product does not exists.`,
            success: false
        })
    } 

    return response.status(200).json({
        message: `single product`,
        success: true,
        product
    })
})

const updateProduct = asyncHandler(async(request, response) => {
    const { id } = request.params

    const product = await product.findById( id )

    if(!product){
        return response.status(404).json({
            message: `product does not exists.`,
            success: false
        })
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, request.body, { returnDocument: 'after' })

    return response.status(200).json({
        message: `update product`,
        success: true,
        updatedProduct
    })
})

const deleteProduct = asyncHandler(async(request, response) => {
    const { id } = request.params

    const product = await product.findById( id )

    if(!product){
        return response.status(404).json({
            message: `product does not exists.`,
            success: false
        })
    }

    await delete_from_cloudinary(product.product_image_public_id)
    await Product.findByIdAndDelete(id)

    return response.status(200).json({
        message: `delete product`,
        success: true
    })
})

export {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct
}