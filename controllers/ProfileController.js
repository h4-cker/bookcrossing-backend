import UserModel from "../models/User"
import AdModel from "../models/Ad.js";
import bcrypt from "bcrypt";

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
  try {
    const userId = req.params.id;
    const password = req.params.password;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        passwordHash: passwordHash
      }
    );

    return res.status(200).json({
      message: "Пароль обновлен",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось обновить пароль",
    });
  }
}

export const updateEmail = async (req, res) => {
  try {
    const userId = req.params.id;
    const email = req.params.email;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        email: email
      }
    );

    return res.status(200).json({
      message: "Почта обновлена",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось обновить почту",
    });
  }
}

export const updateName = async (req, res) => {
  try {
    const userId = req.params.id;
    const name = req.params.name;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        name: name
      }
    );

    return res.status(200).json({
      message: "Имя обновлено",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось обновить имя",
    });
  }
}

export const removeMe = async (req, res) => {

}