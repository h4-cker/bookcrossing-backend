import { Router } from "express";
import checkAuth from "../middlewares/checkAuth.js";

import * as ProfileController from "../controllers/ProfileController.js";
import checkOwnership from "../middlewares/checkOwnership.js";

const router = new Router();

router.get("/:id", checkAuth, checkOwnership, ProfileController.getMe);

router.post("/setAvatar", checkAuth, ProfileController.setAvatar);

router.patch("/name", checkAuth, ProfileController.updateName);
router.patch("/email", checkAuth, ProfileController.updateEmail);
router.patch("/password", checkAuth, ProfileController.updatePassword);

router.delete("/:id", checkAuth, ProfileController.removeMe);

export default router;
