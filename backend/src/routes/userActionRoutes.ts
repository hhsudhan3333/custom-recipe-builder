import express from "express";
import {
  saveRecipe,
  shareRecipe,
  getSavedRecipes,
  deleteSavedRecipe,
} from "../controllers/userActionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Save/Favorite recipe
router.post("/save", authMiddleware, saveRecipe);

// Share recipe
router.post("/share",  authMiddleware, shareRecipe);

// Get saved recipes by user
router.get("/saved", authMiddleware, getSavedRecipes);

// Delete saved recipe
router.delete("/saved/:id", authMiddleware, deleteSavedRecipe);

export default router;
