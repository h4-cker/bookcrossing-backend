import { body } from "express-validator";

export const adCreationValidation = [
  body("name", "Название книги должно быть задано").notEmpty(),
  body("author", "Неверный формат ввода инициалов и фамилии автора")
    .notEmpty()
    .custom((value) => {
      const authorRegex =
        /(^[А-Я]\.[А-Я]\.([А-Я][а-я]+))|(^[A-Z]\.[A-Z]\.([A-Z][a-z]+))$/;
      return authorRegex.test(value);
    }),
  body("genre", "Название жанра должно быть задано").notEmpty(),
  body("isbn", "ISBN должен быть задан").notEmpty(),
  body("language", "Язык должен быть задан").notEmpty(),
  body("year", "Год должен быть числом").isNumeric(),
  body("description", "Описание должно быть задано").notEmpty(),
  body("location", "Местоположение должно быть задано").notEmpty(),
  body("type", "Тип должен быть задан").notEmpty(),
  body("imageUrl", "В объявлении должна быть картинка").notEmpty(),
];
