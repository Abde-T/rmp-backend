import mongoose from "mongoose";

const connectDB = async (url) => {
  try {
    // Set connection options for better performance
    const options = {
      useUnifiedTopology: true,
    };

    // Connect to MongoDB
    await mongoose.connect(url, options);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process on connection failure
  }
};

export default connectDB;