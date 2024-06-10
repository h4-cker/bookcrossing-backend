import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import adsRoutes from "./routes/ads.js";
import cookieParser from "cookie-parser";
import Fingerprint from "express-fingerprint";
import multer from "multer";
import checkAuth from "./middlewares/checkAuth.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true }));
app.use(
  Fingerprint({
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/uploads", express.static("uploads"));

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
