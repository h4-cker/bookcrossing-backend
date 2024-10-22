import { Router } from "express";

import * as CategoryController from "../controllers/CategoryController.js";

const router = new Router();

router.get("/books", CategoryController.getBooksCategories);
router.get("/locations", CategoryController.getLocations);
router.get("/locations/getUserLocation", CategoryController.getUserLocation);

export default router;
