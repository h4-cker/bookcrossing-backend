import BookModel from "../models/Book.js";

export const create = async (req, res) => {
  try {
    const doc = new BookModel({
      name: req.body.name,
      author: req.body.author,
      genre: req.body.genre,
      isbn: req.body.isbn,
      language: req.body.language,
      year: req.body.year,
    });

    const book = await doc.save();

    res.json(book);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Не удалось создать книгу",
    });
  }
};
