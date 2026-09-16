import asyncHandler from "express-async-handler";
import Category from "../models/category.model.mjs";

const getAllCategories = asyncHandler(async(request, response) => {
    const categories = await Category.find()

    return response.status(200).json({
        message: `all category`,
        success: true,
        categories
    }) 
})

const createCategory = asyncHandler(async(request, response) => {
    const { category_name } = request.body

    if(!category_name){
        return response.status(400).json({
            message: `Please provide category.`,
            success: false
        })
    }

    const categoryExists = await Category.findOne({ category_name })
    if(categoryExists){
        return response.status(409).json({
            message: `Category already exists.`,
            success: false
        })
    }

    const category = await Category.create({ category_name })

    return response.status(201).json({
        message: `added new category`,
        success: true,
        category
    })
})

const getSingleCategory = asyncHandler(async(request, response) => {
    const { id } = request.params

    const category = await Category.findById( id )

    if(!category){
        return response.status(404).json({
            message: `Category does not exists.`,
            success: false
        })
    } 

    return response.status(200).json({
        message: `single category`,
        success: true,
        category
    })
})

const updateCategory = asyncHandler(async(request, response) => {
    const { id } = request.params

    const category = await Category.findById( id )

    if(!category){
        return response.status(404).json({
            message: `Category does not exists.`,
            success: false
        })
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, request.body, { returnDocument: 'after' })

    return response.status(200).json({
        message: `update category`,
        success: true,
        updateCategory
    })
})

const deleteCategory = asyncHandler(async(request, response) => {
    const { id } = request.params

    const category = await Category.findById( id )

    if(!category){
        return response.status(404).json({
            message: `Category does not exists.`,
            success: false
        })
    }

    await Category.findByIdAndDelete(id)

    return response.status(200).json({
        message: `delete category`,
        success: true
    })
})

export {
    getAllCategories,
    createCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory
}