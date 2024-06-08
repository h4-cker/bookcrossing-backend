import { Router } from "express";
import { loginValidation, registerValidation } from "../validations/auth.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

import * as AuthController from "../controllers/AuthController.js";

const router = new Router();

router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  AuthController.register
);

router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  AuthController.login
);

router.post("/logout", AuthController.logout);

export default router;
