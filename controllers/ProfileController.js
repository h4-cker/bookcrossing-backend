import UserModel from "../models/User"
import AdModel from "../models/Ad.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await AdModel.find()
      .exec();

    if (users.length) {
      return res.json(users);
    } else {
      return res.json({
        message: "Пользователи не найдены",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось получить пользователей",
    });
  }
}

export const getMe = (req, res) => {
  try {
    const userId = req.params.id;
    const me = UserModel.find({ _id: userId})
      .exec();

    if (!me) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    } else {
      return res.json(me);
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось получить пользователя",
    });
  }
}

export const updatePassword = async (req, res) => {

}

export const updateEmail = async (req, res) => {

}

export const updateName = async (req, res) => {

}

export const removeMe = async (req, res) => {

}