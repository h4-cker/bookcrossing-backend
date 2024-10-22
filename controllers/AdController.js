import { DEFAULT_SORT_VALUE } from "../config.js";
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
      releaseYear: req.body.bookReleaseYear,
    });

    const book = await bookDoc.save();

    const adDoc = new AdModel({
      user: req.userId,
      content: book._id,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      location: req.body.location,
      type: req.body.type,
      contacts: req.body.contacts,
    });

    await adDoc.save();

    res.status(200).json({ message: "Объявление успешно создано" });
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

    const ad = await AdModel.findOne({ _id: adId })
      .populate(["user", "content"])
      .exec();

    if (!ad) {
      return res.status(404).json({
        message: "Объявление не найдено",
      });
    }

    delete ad.user._doc.passwordHash;

    return res.status(200).json(ad);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось получить объявление",
    });
  }
};

export const getFromLocation = async (req, res) => {
  try {
    const location = req.params.location;

    let ads = await AdModel.find({ location: location, ...req.AdQueryParams })
      .sort({ createdAt: req.sort ? req.sort : DEFAULT_SORT_VALUE })
      .populate(["user", "content"])
      .exec();

    const contentIds = ads.map((ad) => {
      return ad.content._id;
    });

    const books = await BookModel.find({
      _id: { $in: contentIds },
      ...req.bookQueryParams,
    });

    const filteredContentIds = books.map((book) => book._id);

    if (books.length) {
      ads = ads.filter((ad) => {
        return filteredContentIds.some((id) => id.equals(ad.content._id));
      });

      ads.forEach((ad) => {
        delete ad.user._doc.passwordHash;
      });

      return res.status(200).json(ads);
    } else {
      return res.status(404).json({
        message: "Объявления не найдены",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось получить объявления",
    });
  }
};

export const getFromUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const ads = await AdModel.find({ user: userId })
      .populate(["user", "content"])
      .exec();

    if (ads.length) {
      ads.forEach((ad) => {
        delete ad.user._doc.passwordHash;
      });

      return res.status(200).json(ads);
    } else {
      return res.status(404).json({
        message: "Объявления не найдены",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось получить объявления",
    });
  }
};

export const update = async (req, res) => {
  try {
    const adId = req.params.id;

    const ad = await AdModel.findById(adId);
    if (!ad) {
      return res.status(404).json({
        message: "Объявление не найдено",
      });
    }

    const content = await BookModel.findById(ad.content);
    if (!content) {
      return res.status(404).json({
        message: "Контент не найден",
      });
    }

    await AdModel.updateOne(
      {
        _id: adId,
      },
      {
        user: req.userId,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        location: req.body.location,
        type: req.body.type,
      }
    );

    await BookModel.updateOne(
      {
        _id: content._id,
      },
      {
        name: req.body.bookName,
        author: req.body.bookAuthor,
        genre: req.body.bookGenre,
        ISBN: req.body.bookISBN,
        language: req.body.bookLanguage,
        year: req.body.bookReleaseYear,
      }
    );

    return res.status(200).json({
      message: "Объявление обновлено",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось обновить объявление",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const adId = req.params.id;

    const ad = await AdModel.findById(adId);
    if (!ad) {
      return res.status(404).json({
        message: "Объявление не найдено",
      });
    }

    const content = await BookModel.findById(ad.content);
    if (!content) {
      return res.status(404).json({
        message: "Контент не найден",
      });
    }

    await AdModel.deleteOne({ _id: adId });
    await BookModel.deleteOne({ _id: content._id });

    return res.status(200).json({
      message: "Объявление удалено",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось удалить объявление",
    });
  }
};
