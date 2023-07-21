import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required:  true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  linkedin: { type: String, required: true },
  gitHub:  { type: String, required: true },
  website: { type: String, required: true },
  selectedFile: { type: String, required: false },
  id: { type: String },
});

const User = mongoose.model('User', userSchema)
export default User;