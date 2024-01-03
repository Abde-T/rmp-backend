import express from "express";
import mongoose from "mongoose";
import PostDescription from "../models/postDescription.js";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 50;
    const startIndex = (Number(page) - 1) * LIMIT;

    const total = await PostDescription.countDocuments({});
    const posts = await PostDescription.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");

    const posts = await PostDescription.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    }).lean();

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostDescription.findById(id).lean();

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsByCreator = async (req, res) => {
  const { name } = req.query;

  try {
    const posts = await PostDescription.find({ name }).lean();

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { selectedFile, ...post } = req.body;
  console.log(post);
  try {
    // Upload the image to Cloudinary
    const photoUrl = await cloudinary.uploader.upload(selectedFile);

    // Create a new post with the Cloudinary URL assigned to selectedFile
    const newPostDescription = new PostDescription({
      ...post,
      selectedFile: photoUrl.secure_url, // Use secure_url for HTTPS
      creator: req.userId,
      createdAt: new Date().toISOString(),
    });

    // Save the new post to MongoDB
    await newPostDescription.save();

    // Send the new post as a response
    res.status(201).json(newPostDescription);
  } catch (error) {
    // Handle errors
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  try {
    // Check if a new image is provided for updating
    let updatedSelectedFile = selectedFile;
    if (selectedFile) {
      const photoUrl = await cloudinary.uploader.upload(selectedFile);
      updatedSelectedFile = photoUrl.secure_url; // Use secure_url for HTTPS
    }

    // Create the updatedPost object with the new Cloudinary URL
    const updatedPost = {
      creator,
      title,
      message,
      tags,
      selectedFile: updatedSelectedFile, // Assign the new Cloudinary URL
      _id: id,
    };

    // Update the post in MongoDB
    const result = await PostDescription.findByIdAndUpdate(id, updatedPost, {
      new: true,
    });

    // Return the updated post as the response
    res.json(result);
  } catch (error) {
    // Handle any errors during the update process
    res.status(500).json({ message: "Failed to update the post." });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await PostDescription.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostDescription.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostDescription.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.status(200).json(updatedPost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await PostDescription.findById(id);

  post.comments.push(value);

  const updatedPost = await PostDescription.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export default router;
