import { Router } from "express";
import { loginValidation, registerValidation } from "../validations/auth.js";

import * as AuthController from "../controllers/AuthController.js";

const router = new Router();

router.post("/register", registerValidation, AuthController.register);

router.post("/login", loginValidation, AuthController.login);

export default router;
