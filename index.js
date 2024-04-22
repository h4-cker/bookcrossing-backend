import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import adsRoutes from "./routes/ads.js";
import booksRoutes from "./routes/books.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/books/", booksRoutes);

async function connectDB() {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => startServer())
    .catch((error) => console.log("DB error: ", error.message));
}

function startServer() {
  try {
    app.listen(process.env.PORT, () =>
      console.log(`Server has been started on port ${process.env.PORT}`)
    );
  } catch (error) {
    console.log("Server error: ", error.message);
    process.exit(1);
  }
}

connectDB();
