import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import connectDB from "./mongodb/connect.js";
import cacheMiddleware from './middleware/cacheMiddleware.js';
import compression from "compression";

const app = express();
dotenv.config();
const cacheDuration = 60;


app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(compression());
app.use(cacheMiddleware(cacheDuration))

app.use(cors({
  origin: [process.env.FrontendLink, "http://localhost:5173", "https://rmp-abde-t.vercel.app/"]
}));

app.use("/posts", postRoutes);
app.use("/user", userRoutes);


async function startServer()  {
  try {
    connectDB(process.env.CONNECTION_URL);

    app.listen(process.env.PORT || 3000, () => console.log(`Server running on port: ${process.env.PORT || 3000}`));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
