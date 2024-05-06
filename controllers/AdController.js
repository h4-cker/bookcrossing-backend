import AdModel from "../models/Ad.js";
import BookModel from "../models/Book.js";

export const create = async (req, res) => {
  try {
    const bookDoc = new BookModel({
      name: req.body.bookName,
      author: req.body.bookAuthor,
      genre: req.body.bookGenre,
      ISBN: req.body.bookISBN,
      language: req.body.bookLanguage,
      year: req.body.bookReleaseYear,
    });

    const book = await bookDoc.save();

    const adDoc = new AdModel({
      user: req.userId,
      content: book._id,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      location: req.body.location,
      type: req.body.type,
    });

    const ad = await adDoc.save();

    res.json(ad);
  } catch (e) {
    console.log(e.message);

    res.status(500).json({
      message: "Не удалось создать объявление",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const adId = req.params.id;

    await AdModel.findOne({ _id: adId })
      .populate(["user", "content"])
      .exec()
      .then((ad) => {
        if (!ad) {
          return res.status(404).json({
            message: "Объявление не найдено",
          });
        }

        ad.user = { name: ad.user.name };

        res.json(ad);
      })
      .catch((e) => {
        console.log(e.message);
        return res.status(500).json({
          message: "Не удалось получить объявление",
        });
      });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось получить объявление",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const ads = await AdModel.find().populate(["user", "book"]).exec();
    res.json(ads);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить объявления",
    });
  }
};

export const update = async (req, res) => {
  try {
    const adId = req.params.id;

    await AdModel.updateOne(
      {
        _id: adId,
      },
      {
        user: req.userId,
        book: req.body.book,
        image: req.body.image,
        description: req.body.description,
        location: req.body.location,
        type: req.body.type,
      }
    );

    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось обновить объявление",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const adId = req.params.id;
    AdModel.findOneAndDelete(
      {
        _id: adId,
      },
      (e, ad) => {
        if (e) {
          console.log(e);
          return res.status(500).json({
            message: "Не удалось удалить объявление",
          });
        }

        if (!ad) {
          return res.status(404).json({
            message: "Объявление не найдено",
          });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось получить объявление",
    });
  }
};
