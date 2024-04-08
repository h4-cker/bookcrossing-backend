import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoute);

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
