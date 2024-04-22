import { body } from "express-validator";

export const adCreationValidation = [
  body("description", "Описание должно быть задано").notEmpty(),
  body("location", "Местоположение должно быть задано").notEmpty(),
  body("type", "Тип должен быть задан").notEmpty(),
  body("imageUrl", "В объявлении должна быть картинка").notEmpty(),
];
