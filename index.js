import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import connectDB from "./mongodb/connect.js";
import cacheMiddleware from './middleware/cacheMiddleware.js';

const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(cors());
app.use(cacheMiddleware())

app.use("/posts", postRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    connectDB(process.env.CONNECTION_URL);

    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
