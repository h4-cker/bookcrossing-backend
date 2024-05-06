import { body } from "express-validator";

export const adCreationValidation = [
  body("description", "Описание должно быть задано").notEmpty(),
  body("location", "Местоположение должно быть задано").notEmpty(),
  body("type", "Тип должен быть задан").notEmpty(),
  body("imageUrl", "В объявлении должна быть картинка").notEmpty(),
  body("bookName", "Название книги должно быть задано").notEmpty(),
  body("bookAuthor")
    .notEmpty()
    .withMessage("Инициалы и фамилия автора должны быть заданы")
    .custom((value) => {
      const authorRegex =
        /(^[А-Я]\.[А-Я]\.([А-Я][а-я]+))|(^[A-Z]\.[A-Z]\.([A-Z][a-z]+))$/;
      return authorRegex.test(value);
    })
    .withMessage("Неверный формат ввода инициалов и фамилии автора"),
  body("bookGenre", "Название жанра должно быть задано").notEmpty(),
  body("bookISBN")
    .notEmpty()
    .withMessage("ISBN должен быть задан")
    .custom((value) => {
      const ISBNRegex = /^(978|979)-\d{1,5}-\d{1,7}-\d{1,7}-\d$/;
      return ISBNRegex.test(value);
    })
    .withMessage("Неверный формат ввода ISBN"),
  body("bookLanguage", "Язык должен быть задан").notEmpty(),
  body("bookReleaseYear", "Год должен быть числом").isNumeric(),
];
