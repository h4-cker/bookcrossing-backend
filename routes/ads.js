import { Router } from "express";
import checkAuth from "../middlewares/checkAuth.js";
import checkSort from "../middlewares/checkSort.js";
import { adCreationValidation } from "../validations/ads.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

import * as AdController from "../controllers/AdController.js";
import modifyQuery from "../middlewares/modifyQuery.js";

const router = new Router();

router.post(
  "/create",
  checkAuth,
  adCreationValidation,
  handleValidationErrors,
  AdController.create
);

router.get("/books/:id", AdController.getOne);
router.get(
  "/locations/:location/books",
  checkSort,
  modifyQuery,
  AdController.getFromLocation
);
router.get("/users/:id/books", checkAuth, AdController.getFromUser);

router.patch("/books/:id", checkAuth, AdController.update);

router.delete("/books/:id", checkAuth, AdController.remove);

export default router;
