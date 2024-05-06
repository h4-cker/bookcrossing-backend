import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String, // пользователь будет выбирать из установленных Genre
    },
    ISBN: {
      type: String,
      required: true,
    },
    language: {
      type: String, // пользователь будет выбирать из установленных Language
      required: true,
    },
    releaseYear: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Book", BookSchema);
