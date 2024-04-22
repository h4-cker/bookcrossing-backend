import { Router } from "express";
import checkAuth from "../middlewares/checkAuth.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import { bookCreationValidation } from "../validations/books.js";

import * as BookController from "../controllers/BookController.js";

const router = new Router();

router.post(
  "/create",
  checkAuth,
  bookCreationValidation,
  handleValidationErrors,
  BookController.create
);

export default router;
