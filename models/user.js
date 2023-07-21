import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required:  true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  linkedin: { type: String, required: false },
  gitHub:  { type: String, required: false },
  website: { type: String, required: false },
  selectedFile: { type: String, required: false },
  id: { type: String },
});


const User = mongoose.model('User', userSchema)
export default User;