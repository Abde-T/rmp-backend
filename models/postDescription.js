import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  message: String,
  name: String,
  creator: String,
  gitHub: String,
  website: String,
  tags: { type: [String], index: true },
  selectedFile: String,
  likes: {
    type: [String],
    default: [],
    index: true,
  },
  comments: { type: [String], default: [], index: true },
  createdAt: {
    type: Date,
    default: new Date(),
    index: true,
  },
});

const PostDescription = mongoose.model("PostDescription", postSchema);
export default PostDescription;
