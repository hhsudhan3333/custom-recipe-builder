import express from "express";
import {
  saveRecipe,
  shareRecipe,
  getSavedRecipes,
  deleteSavedRecipe,
} from "../controllers/userActionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/save", authMiddleware, saveRecipe);
router.post("/share",  authMiddleware, shareRecipe);
router.get("/saved", authMiddleware, getSavedRecipes);
router.delete("/saved/:id", authMiddleware, deleteSavedRecipe);

export default router;
