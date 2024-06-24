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

export const getLocations = async (req, res) => {
  try {
    const searchParams = new URLSearchParams({
      type: "city",
      countryCode: "RU",
      lng: "ru",
    }).toString();

    const response = await fetch(
      `https://data-api.oxilor.com/rest/regions?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.OXILOR_API_TOKEN}`,
        },
      }
    );

    let data = await response.json();

    let cities = [];

    for (let edge of data.edges) {
      cities.push(edge.node.name);
    }

    return res.status(200).json(cities);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось получить список местоположений",
    });
  }
};

export const getUserLocation = async (req, res) => {
  try {
    const userIp = req.query.ip;

    const searchParams = new URLSearchParams({
      ip: userIp,
      lng: "ru",
    }).toString();

    const response = await fetch(
      `https://data-api.oxilor.com/rest/network?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.OXILOR_API_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (data.region.countryCode != "RU") {
      return res.status(200).json({
        message: "Пользователь не из России. Возвращено дефолтное значение",
        userLocation: "Москва",
      });
    }

    return res.status(200).json({ userLocation: data.region.name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось получить местоположение пользователя",
    });
  }
};
