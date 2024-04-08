import { body } from "express-validator";

export const registerValidation = [
  body("name", "Имя должно быть задано").notEmpty(),
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Минимальная длина пароля 6 символов").isLength({ min: 6 }),
];
