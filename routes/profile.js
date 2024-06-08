import { Router } from "express";
import checkAuth from "../middlewares/checkAuth.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

import * as ProfileController from "../controllers/ProfileController.js";
import * as AdController from "../controllers/AdController.js";

const router = new Router();

router.post(
  "/me/:id",
  checkAuth,
  handleValidationErrors,
  ProfileController.getMe
);

router.patch("/:id", checkAuth, ProfileController.updateName);
router.patch("/:id", checkAuth, ProfileController.updateEmail);
router.patch("/:id", checkAuth, ProfileController.updatePassword);

router.delete("/:id", checkAuth, ProfileController.removeMe);

export default router;