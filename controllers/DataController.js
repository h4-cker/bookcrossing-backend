import AdModel from "../models/Ad.js";

{ // ad.content.year
  export const sortYearsByAsc = async (req, res) => {
    try {
      const ads = await AdModel.find()
        .sort({ 'content.releaseYear': 1 }) // -1 для сортировки по убыванию, 1 для сортировки по возрастанию
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
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Не удалось получить объявления",
      });
    }
  }

  export const sortYearsByDesc = async (req, res) => {
    try {
      const ads = await AdModel.find()
        .sort({ 'content.releaseYear': -1 }) // -1 для сортировки по убыванию, 1 для сортировки по возрастанию
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
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Не удалось получить объявления",
      });
    }
  }

  export const searchByYear = async (req, res) => {
    try {
      const year = req.params.year;
      const ads = await AdModel.find({ 'content.releaseYear': year })
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
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Не удалось получить объявления",
      });
    }
  }
}

{ // ad.content.name
  export const sortByNamesAsc = async (req, res) => {
    try {
      const ads = await AdModel.find()
        .sort({ 'content.name': 1 }) // -1 для сортировки по убыванию, 1 для сортировки по возрастанию
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
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Не удалось получить объявления",
      });
    }
  }

  export const sortByNamesDesc = async (req, res) => {
    try {
      const ads = await AdModel.find()
        .sort({ 'content.name': -1 }) // -1 для сортировки по убыванию, 1 для сортировки по возрастанию
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
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Не удалось получить объявления",
      });
    }
  }

  export const searchByName = async (req, res) => {
    try {
      const keyword = req.params.keyword;
      const ads = await AdModel.find({ 'content.name': { $regex: keyword, $options: 'i' } })
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
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Не удалось получить объявления",
      });
    }
  }
}

{ // ad.content.author
  export const sortByAuthorAsc = async (req, res) => {
    try {
      const ads = await AdModel.find()
        .sort({ 'content.author': 1 }) // -1 для сортировки по убыванию, 1 для сортировки по возрастанию
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
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Не удалось получить объявления",
      });
    }
  }

  export const sortByAuthorDesc = async (req, res) => {
    try {
      const ads = await AdModel.find()
        .sort({ 'content.author': -1 }) // -1 для сортировки по убыванию, 1 для сортировки по возрастанию
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
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Не удалось получить объявления",
      });
    }
  }

  export const searchByAuthor = async (req, res) => {
    try {
      const author = req.params.author;
      const ads = await AdModel.find({ 'content.author': { $regex: author, $options: 'i' } })
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
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Не удалось получить объявления",
      });
    }
  }
}

export const searchByLanguage = async (req, res) => {
  try {
    const language = req.params.language;
    const ads = await AdModel.find({ 'content.language': language })
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
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Не удалось получить объявления",
    });
  }
}

export const searchByISBN = async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const ads = await AdModel.find({ 'content.ISBN': isbn })
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
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Не удалось получить объявления",
    });
  }
}

export const searchByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;
    const ads = await AdModel.find({ 'content.genre': genre })
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
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Не удалось получить объявления",
    });
  }
}

export const searchByPassType = async (req, res) => {
  try {
    const type = req.params.type;
    const ads = await AdModel.find({ type: type })
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
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Не удалось получить объявления",
    });
  }
}
