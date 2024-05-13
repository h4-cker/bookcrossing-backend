import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Такой пользователь уже существует" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      name,
      email,
      passwordHash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_KEY
    );

    res.json({
      message: "Пользователь создан",
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Не удалось зарегистрировать пользователя" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Неверный логин или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный логин или пароль" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    return res.json({
      message: "Авторизация прошла успешно",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Не удалось авторизоваться" });
  }
};
