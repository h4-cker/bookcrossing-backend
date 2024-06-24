import { Router } from "express";
import checkAuth from "../middlewares/checkAuth.js";

import * as ProfileController from "../controllers/ProfileController.js";
import checkOwnerShip from "../middlewares/checkOwnerShip.js";

const router = new Router();

router.get("/:id", checkAuth, checkOwnerShip, ProfileController.getMe);

router.patch("/name", checkAuth, ProfileController.updateName);
router.patch("/email", checkAuth, ProfileController.updateEmail);
router.patch("/password", checkAuth, ProfileController.updatePassword);

router.delete("/:id", checkAuth, ProfileController.removeMe);

export default router;
