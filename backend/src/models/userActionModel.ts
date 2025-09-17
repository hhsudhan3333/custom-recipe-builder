import { strict } from "assert";
import mongoose, { Schema, Document, Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';


export interface IUserAction extends Document {
  id: string;
  user: string; 
  recipe: string;   
  action: "saved" | "shared"; 
}
const userActionSchema = new Schema<IUserAction>(
  {
    id: { type: String, unique: true, default: uuidv4 },
    user: { type: String, required: true },
    recipe: { type: String, required: true },
    action: { type: String, enum: ["saved", "shared"], required: true },
  },
  { timestamps: true } 
);

userActionSchema.virtual("recipeData", {
  ref: "Recipe",
  localField: "recipe",   
  foreignField: "id",     
  justOne: true
});

userActionSchema.set("toObject", { virtuals: true });
userActionSchema.set("toJSON", { virtuals: true });

export const UserAction = mongoose.model<IUserAction>("UserAction", userActionSchema);