import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    linkedin: String,
    gitHub: String,
    website:String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default:[]
    },
    comments: { type: [String], default: [] },
    createdAt: {
        type:Date,
        default: new Date()
    }
})

const PostDescription = mongoose.model('PostDescription', postSchema)
export default PostDescription;