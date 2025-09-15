import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { updateProfile, getProfile } from "../controllers/profileController";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/update/profile", authMiddleware, updateProfile);
export default router;
