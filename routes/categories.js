import { Router } from "express";

import * as CategoryController from "../controllers/CategoryController.js";

const router = new Router();

router.get("/locations/:location/books", CategoryController.getBooksCategories);

export default router;
