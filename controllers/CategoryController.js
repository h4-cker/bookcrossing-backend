import BookModel from "../models/Book.js";
import { Genre, Language, PassType } from "../models/CustomTypes.js";

export const getBooksCategories = async (req, res) => {
  try {
    const categories = {
      authors: await BookModel.distinct("author"),
      genres: Object.values(Genre),
      languages: Object.values(Language),
      releaseYears: await BookModel.distinct("releaseYear"),
      passTypes: Object.values(PassType),
    };

    return res.status(200).json(categories);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Не удалось получить список категорий" });
  }
};
