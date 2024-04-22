import { body } from "express-validator";

export const bookCreationValidation = [
  body("name", "Название книги должно быть задано").notEmpty(),
  body("author", "Неверный формат ввода инициалов и фамилии автора")
    .notEmpty()
    .custom((value) => {
      const authorRegex =
        /(^[А-Я]\.[А-Я]\.([А-Я][а-я]+))|(^[A-Z]\.[A-Z]\.([A-Z][a-z]+))$/;
      return authorRegex.test(value);
    }),
  body("genre", "Название жанра должно быть задано").notEmpty(),
  body("isbn", "Неверный формат ввода isbn")
    .notEmpty()
    .custom((value) => {
      const isbnRegex = /^(978|979)-\d{1,5}-\d{1,7}-\d{1,7}-\d$/;
      return isbnRegex.test(value);
    }),
  body("language", "Язык должен быть задан").notEmpty(),
  body("year", "Год должен быть числом").isNumeric(),
];
