import { Request, Response } from "express";
import { UserAction } from "../models/userActionModel";
import { AuthRequest } from "../middlewares/authMiddleware";



export const saveRecipe = async (req: Request, res: Response) => {
const authReq = req as AuthRequest;
  try {
    const userId = typeof authReq.user === "string" ? authReq.user : authReq.user?.id;
    const { recipeId } = req.body;

    const existing = await UserAction.findOne({ user: userId, recipe: recipeId, action: "saved" });
    if (existing) return res.status(400).json({
          success: false,
          message: "Recipe already saved",
          data: [],
    });

    const saved = new UserAction({ user: userId, recipe: recipeId, action: "saved" });
    await saved.save();

    return res.status(201).json({
        success: true,
        message: "Saved successfully",
        data: [saved], 
    }); 
  } catch (err) {
    return res.status(500).json({
          success: false,
          message: "Server Error",
          data: [],
    });
  }
};


export const shareRecipe = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    const userId = typeof authReq.user === "string" ? authReq.user : authReq.user?.id;

    const { recipeId } = req.body;

    const shared = new UserAction({ user: userId, recipe: recipeId, action: "shared" });
    await shared.save();

    return res.status(201).json({
        success: true,
        message: "Shared successfully",
        data: [shared], 
    });
  } catch (err) {
    return res.status(500).json({
          success: false,
          message: "Server Error",
          data: [],
    });
  }
};


export const getSavedRecipes = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    const userId = (authReq.user as { id: string }).id; 
    const savedRecipes = await UserAction.find({ user: userId, action: "saved" })
    .populate("recipeData", "title slug description image servings cookTime ");

    return res.status(200).json({
      success: true,
      message: "Recipe fetched successfully",
      data: savedRecipes,
    });
 } catch (err) {
    return res.status(500).json({
          success: false,
          message: "Server Error",
          data: [],
    });
  }
};

export const deleteSavedRecipe = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = await UserAction.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Saved recipe not found",
        data: [],
      });
    }

    return res.json({
      success: true,
      message: "Saved recipe deleted successfully",
      data: deleted,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      data: [],
    });
  }
};

