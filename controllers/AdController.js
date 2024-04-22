import AdModel from "../models/Ad.js";

export const create = async (req, res) => {
  try {
    const doc = new AdModel({
      user: req.userId,
      book: req.body.bookId,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      location: req.body.location,
      type: req.body.type,
    });

    const ad = await doc.save();

    res.json(ad);
  } catch (e) {
    console.log(e);

    res.status(500).json({
      message: "Не удалось создать объявление",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const adId = req.params.id;

    await AdModel.findOne({ _id: adId }, (e, ad) => {
      if (e) {
        console.log(e);
        return res.status(500).json({
          message: "Не удалось вернуть объявление",
        });
      }

      if (!ad) {
        return res.status(404).json({
          message: "Объявление не найдено",
        });
      }

      res.json(ad);
    }).populate(["user", "book"]);
  } catch (err) {
    console.log(err);
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
