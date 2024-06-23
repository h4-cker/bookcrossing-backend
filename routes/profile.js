import { Router } from "express";
import checkAuth from "../middlewares/checkAuth.js";

import * as ProfileController from "../controllers/ProfileController.js";

const router = new Router();

router.post("/:id", checkAuth, ProfileController.getMe);

router.patch("/name", checkAuth, ProfileController.updateName);
router.patch("/email", checkAuth, ProfileController.updateEmail);
router.patch("/password", checkAuth, ProfileController.updatePassword);

router.delete("/:id", checkAuth, ProfileController.removeMe);

export default router;
