import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload_on_cloudinary = async (file_path) => {
  try {
    if (!file_path) {
      console.log(`File path not provided.`);
      return null;
    }

    const result = await cloudinary.uploader.upload(file_path, {
      resource_type: "image",
      folder: "ecommerce_website_media",
    });
    console.log("UPLOADED RESULT: ", result);
    fs.unlinkSync(file_path);

    return result;
  } catch (error) {
    fs.unlinkSync(file_path);
    console.log("Error in uplaoding to cloudinary: ", error.message);
    return null;
  }
};

export default upload_on_cloudinary