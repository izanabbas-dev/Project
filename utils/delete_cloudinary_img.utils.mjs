import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const delete_from_cloudinary = async(public_id) => {
    await cloudinary.uploader.destroy(public_id)
    console.log("Cloudinary image has been deleted.")
}

export default delete_from_cloudinary