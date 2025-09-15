import express from "express";
import { getAllCategories, getRecipesByCategorySlug, createCategory } from "../controllers/categoryController";

const router = express.Router();

router.get("/", getAllCategories); 
router.get("/:slug", getRecipesByCategorySlug); 
router.post("/addcategory", createCategory)
export default router;
    