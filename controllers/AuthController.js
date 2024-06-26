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
      fingerprint: fingerprint.hash,
    });

    await refreshSession.save();

    res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

    return res.json({
      message: "Пользователь создан",
      accessToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      userId: user._id,
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
    const { fingerprint } = req;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Неверный логин или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный логин или пароль" });
    }

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
      fingerprint: fingerprint.hash,
    });

    await refreshSession.save();

    res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

    return res.json({
      message: "Аутентификация прошла успешно",
      accessToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      userId: user._id,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Не удалось аутентифицировать пользователя" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error("Отсутствует refresh token");
    }

    await RefreshSessionModel.deleteOne({ refreshToken: refreshToken });

    res.clearCookie("refreshToken");

    return res
      .status(200)
      .json({ message: "Выход из аккаунта успешно выполнен" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Не удалось выйти" });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { fingerprint } = req;

    if (!refreshToken) {
      return res.status(403).json({ message: "Отсутствует refresh token" });
    }

    const refreshSession = await RefreshSessionModel.findOne({
      refreshToken: refreshToken,
    });

    if (!refreshSession) {
      return res
        .status(403)
        .json({ message: "Не найдена refresh session с таким токеном" });
    }

    if (refreshSession.fingerprint !== fingerprint.hash) {
      return res.status(403).json({
        message:
          "Fingerprint браузера запроса не совпадает с fingerprint сессии",
      });
    }

    await RefreshSessionModel.deleteOne({ refreshToken: refreshToken });

    let payload = undefined;

    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Срок действия refresh token истек" });
    }

    const userId = payload.userId;

    const newAccessToken = jwt.sign(
      {
        userId: userId,
      },
      process.env.ACCESS_TOKEN_KEY,
      {
        expiresIn: "15m",
      }
    );

    const newRefreshToken = jwt.sign(
      {
        userId: userId,
      },
      process.env.REFRESH_TOKEN_KEY,
      {
        expiresIn: "15d",
      }
    );

    const newRefreshSession = new RefreshSessionModel({
      user: userId,
      refreshToken: newRefreshToken,
      fingerprint: fingerprint.hash,
    });

    await newRefreshSession.save();

    res.cookie("refreshToken", newRefreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

    return res.status(200).json({
      message: "Обновление токенов прошло успешно",
      accessToken: newAccessToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Не удалось обновить токен" });
  }
};
