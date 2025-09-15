import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authMiddleware } from "../middlewares/authMiddleware";
import {addRecipe, getRecipeById , getAllRecipes, updateRecipe, deleteRecipe} from "../controllers/recipeController";


const router = express.Router();
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // make sure /uploads exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Why this base path? We'll mount as /api/recipes in server
router.post("/add", authMiddleware, addRecipe);
router.get("/", getAllRecipes); // read all (public; supports ?mine=true)
router.get("/:id", getRecipeById);
router.put("/:id", authMiddleware, updateRecipe); // update (protected + ownership)
router.delete("/:id", authMiddleware, deleteRecipe); // delete (protected + ownership)

export default router;