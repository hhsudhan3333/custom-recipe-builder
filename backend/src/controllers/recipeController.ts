import { Request, Response } from "express";
import mongoose from "mongoose";
import {Recipe, IRecipe} from "../models/recipeModel";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Category } from "../models/categoryModel";

export const addRecipe = async (req: Request, res: Response) => {
  try {
    const { title, description, category, cookTime, servings, image, nutrition, ingredients, steps } = req.body;

    if (!title) {
      return res.status(400).json({ 
          success: false,
          message: "Title is required",
          data: [],
      });
    }

    const recipe = new Recipe({
      title,
      description,
      category,
      cookTime,
      servings,
      image,
      nutrition,
      ingredients,
      steps
    });

    await recipe.save();

    return res.status(201).json({
        success: true,
        message: "Recipe added successfully",
        data: [recipe],
    });
  } catch (error: any) {
    return res.status(500).json({ 
          success: false,
          message: "Failed to add recipe",
          data: [], 
          error: error.message, 
    });
  }
};

export const getAllRecipes = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    const mine = String(req.query.mine || "false").toLowerCase() === "true";
    const categorySlug = (req.query.category as string) || "";
    const categoryId = (req.query.categoryId as string) || "";

    const filter: Record<string, any> = {};
    if (mine) {
      if (!authReq.user || typeof authReq.user === "string") 
        return res.status(401).json({ message: "Unauthorized" });
      filter.createdBy = (authReq.user as { id: string }).id;
    }

    if (categoryId) {
      filter.category = categoryId;
    } else if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug.toLowerCase() }).select("id");
      if (!cat) return res.json({ success: true, data: [] });
      filter.category = cat.id;
    }

    const recipes = await Recipe.find(filter)
    .sort({ createdAt: -1 })
    .populate({path: "category", select: "id name slug",localField: "category",foreignField: "id"});
    return res.json({ success: true, message: "Sucessfully showed" , data: recipes });
  } catch (err) {
    console.error("getAllRecipes error:", err);
    return res.status(500).json({ 
          success: false,
          message: "Server Error",
          data: [], 
     });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipe id",
        data: null,
      });
    }

  const recipe: IRecipe | null = await Recipe.findOne({ id }).populate({
      path: "category",
      select: "id name slug",
    });
 

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Recipe fetched successfully",
      data: {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        nutrition: recipe.nutrition,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        category: recipe.category,
        author: recipe.createdBy, 
      },
    });
  } catch (err) {
    console.error("getRecipeById error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      data: null,
    });
  }
};

export const updateRecipe = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    if (!authReq.user || typeof authReq.user === "string") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: [],
      });
    }

    const { id: userId } = authReq.user as { id: string };
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Recipe id is required",
        data: [],
      });
    }

    const {
      title,
      description,
      ingredients,
      steps,
      category,
      cookTime,
      servings,
      image,
      nutrition,
    } = req.body;
    const update: Record<string, any> = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (ingredients !== undefined) update.ingredients = ingredients;
    if (steps !== undefined) update.steps = steps;
    if (category !== undefined) update.category = category;
    if (cookTime !== undefined) update.cookTime = cookTime;
    if (servings !== undefined) update.servings = servings;
    if (image !== undefined) update.image = image;
    if (nutrition !== undefined) update.nutrition = nutrition;

    const updated = await Recipe.findOneAndUpdate(
      { id: id, createdBy: userId },
      { $set: update },
      { new: true }
    ).populate("category", "id name slug");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found or not owned by you",
        data: [],
      });
    }

    return res.json({
      success: true,
      message: "Recipe updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("updateRecipe error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      data: [],
    });
  }
};


export const deleteRecipe = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    if (!authReq.user || typeof authReq.user === "string") return res.status(401).json({ message: "Unauthorized" });
    const { id: userId } = authReq.user as { id: string };
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) return res.status(400).json({
            success: false,
          message: "Invalid recipe id",
          data: [],
    });

    const deleted = await Recipe.findOneAndDelete({ id: id, createdBy: userId });
    if (!deleted) return res.status(404).json({
          success: false,
          message: "Recipe not found or not owned by you",
          data: [],
    });

    return res.json({ success: true, message: "Recipe deleted" });
  } catch (err) {
    console.error("deleteRecipe error:", err);
    return res.status(500).json({
        success: false,
        message: "Server Error",
        data: [], 
    });
  }
};
function hasNonEmptyArray(ingredients: any) {
  throw new Error("Function not implemented.");
}