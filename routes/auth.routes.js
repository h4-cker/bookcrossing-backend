import { Router } from "express";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import { registerValidation } from "../validations/auth.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

const authRoute = new Router();

authRoute.post("/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Некорректные данные при регистрации",
      });
    }

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
      .json({ message: "Не удалось зарегестрировать пользователя" });
  }
});

export default authRoute;
