import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IRecipe extends Document {
  id:string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image?: string;
  cookTime?: number;
  servings?: number;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  name: String,
  category: string
  createdBy: {
    id: string;
    name: string;
  };
}

const nutritionSchema = new Schema(
  {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
  { _id: false }
);

const recipeSchema = new Schema<IRecipe>(
  {
    id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String],required: true },
    steps: { type: [String],required: true },
    image: { type: String,required: true },
    cookTime: { type: Number, default: 0 ,required: true},
    servings: { type: Number, default: 1,required: true },
    nutrition: nutritionSchema,
     category: { type: String, ref: "Category",required: true },
    createdBy: {
      id: { type: String},
      name: { type: String },
    },
  },
  { timestamps: true,} 
);
recipeSchema.set("toJSON", { virtuals: true });
recipeSchema.set("toObject", { virtuals: true });
export const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
