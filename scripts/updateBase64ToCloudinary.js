import mongoose from "mongoose";
import PostDescription from "../models/postDescription.js";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const updateBase64ToCloudinary = async () => {
  try {
    // Fetch posts where selectedFile is a base64 string
    const posts = await PostDescription.find({ selectedFile: { $regex: /^data:image\/(jpeg);base64,/ } });

    for (const post of posts) {
      // Extract base64 data (assuming it's prefixed with 'data:image/jpeg;base64,' for example)
      const base64Data = post.selectedFile.split(';base64,').pop();

      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Data}`, {
        // Add any additional upload options if necessary
      });

      // Update the post's selectedFile with Cloudinary URL
      await PostDescription.findByIdAndUpdate(post._id, { selectedFile: uploadResponse.url });
    }

    console.log('Base64 images successfully migrated to Cloudinary URLs.');
  } catch (error) {
    console.error('Error updating base64 images to Cloudinary:', error);
  }
};

// Call the function to initiate the migration
updateBase64ToCloudinary();