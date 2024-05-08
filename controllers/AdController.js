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

        ad.user = { name: ad.user.name, _id: ad.user._id };

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

export const getAllFromLocation = async (req, res) => {
  try {
    const location = req.params.location;

    const ads = await AdModel.find({ location: location })
      .populate(["user", "content"])
      .exec();

    if (ads.length) {
      ads.forEach((ad) => {
        ad.user = { name: ad.user.name, _id: ad.user._id };
      });

      return res.json(ads);
    } else {
      return res.json({
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

export const getAllFromUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const ads = await AdModel.find({ user: userId })
      .populate(["user", "content"])
      .exec();

    if (ads.length) {
      ads.forEach((ad) => {
        ad.user = { name: ad.user.name, _id: ad.user._id };
      });

      return res.json(ads);
    } else {
      return res.json({
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
    let contentId = undefined;

    await AdModel.findByIdAndDelete(adId)
      .then((ad) => {
        if (!ad) {
          return res.status(404).json({
            message: "Объявление не найдено",
          });
        }

        contentId = ad.content;

        return res.json({
          message: "Объявление удалено",
        });
      })
      .catch((e) => {
        console.log(e.message);
        return res.status(500).json({
          message: "Не удалось удалить объявление",
        });
      });

    if (!contentId) {
      return;
    }

    BookModel.findByIdAndDelete(contentId).catch((e) => {
      console.log(e.message);
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось удалить объявление",
    });
  }
};
