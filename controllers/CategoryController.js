import BookModel from "../models/Book.js";
import AdModel from "../models/Ad.js";
import { Genre, Language, PassType } from "../models/CustomTypes.js";

export const getBooksCategories = async (req, res) => {
  try {
    const location = req.params.location;

    let ads = await AdModel.find({ location: location })
      .populate(["content"])
      .exec();

    const contentIds = ads.map((ad) => {
      return ad.content._id;
    });

    const categories = {
      authors: await BookModel.distinct("author", {
        _id: { $in: contentIds },
      }),
      genres: Object.values(Genre),
      languages: Object.values(Language),
      releaseYears: await BookModel.distinct("releaseYear", {
        _id: { $in: contentIds },
      }),
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
