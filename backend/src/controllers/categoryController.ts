import { Request, Response } from "express";
import mongoose from "mongoose";
import { Category } from "../models/categoryModel";
import { Recipe } from "../models/recipeModel";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ 
          success: false,
          message: "Name and slug are required",
          data: [],
      });
    }
    const existingCategory = await Category.findOne({
      $or: [{ name: name.trim() }, { slug: slug.toLowerCase() }],
    });

    if (existingCategory) {
      return res.status(400).json({
          success: false,
          message: "Category already exists",
          data: [],
       });  
    }

    const category = new Category({
      name: name.trim(),
      slug: slug.toLowerCase(), 
    });

    await category.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: [
        {
          id: category.id,
          name: category.name,
          slug: category.slug,
        },
      ],
    });
  } catch (err) {
    console.error("createCategory error:", err);
    return res.status(500).json({
        success: false,
        message: "Server error",
        data: [],
    });
  }
};


export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    const categoriesWithCount = await Promise.all(
      categories.map(async (c) => {
        const cnt = await Recipe.countDocuments({ category: c.id });
        return { ...c, recipeCount: cnt };
      })
    );

    return res.json({ success: true, data: categoriesWithCount });
  } catch (err) {
    console.error("getAllCategories error:", err);
    return res.status(500).json({ 
        success: false,
        message: "Server error",
        data: [],
     });
  }
};

export const getRecipesByCategorySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ 
        success: false,
        message: "Name and slug are required",
        data: [],
       });
    }

    const category = await Category.findOne({ slug: slug.toLowerCase() });
    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: "Category not found",
        data: [],
      });
    }

    const recipes = await Recipe.find({ category: category.id })
      .sort({ createdAt: -1 })
      .populate("category", "name slug");

    return res.json({
      success: true,
      category: { name: category.name, slug: category.slug },
      data: recipes,
    });
  } catch (err) {
    console.error("getRecipesByCategorySlug error:", err);
    return res.status(500).json({ 
        success: false,
        message: "Server error",
        data: [],
     });
  }
};
