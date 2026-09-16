import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        category_name: {
            type: String, 
            required: true, 
            unique: true, 
            trim: true, 
            lowercase: true
        }
    },
    { timestamps: true }
)

const Category = mongoose.model("Category", categorySchema)
export default Category