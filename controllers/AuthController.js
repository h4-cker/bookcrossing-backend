import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import RefreshSessionModel from "../models/RefreshSession.js";
import bcrypt from "bcrypt";
import { COOKIE_SETTINGS, ACCESS_TOKEN_EXPIRATION } from "../config.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { fingerprint } = req;

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

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_KEY,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.REFRESH_TOKEN_KEY,
      {
        expiresIn: "15d",
      }
    );

    const refreshSession = new RefreshSessionModel({
      user: user._id,
      refreshToken,
      fingerprint,
    });

    await refreshSession.save();

    res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

    return res.json({
      message: "Пользователь создан",
      accessToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    });
  } catch (error) {
    return res
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
      process.env.ACCESS_TOKEN_KEY,
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

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error("Отсутствует refreshToken");
    }

    await RefreshSessionModel.deleteOne({ refreshToken: refreshToken });

    res.clearCookie("refreshToken");

    return res.json({ message: "Выход из аккаунта успешно выполнен" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Не удалось выйти" });
  }
};
