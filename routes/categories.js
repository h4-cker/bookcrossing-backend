import { Router } from "express";

import * as CategoryController from "../controllers/CategoryController.js";

const router = new Router();

router.get("/books", CategoryController.getBooksCategories);

export default router;
