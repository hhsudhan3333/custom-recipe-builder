import { strict } from "assert";
// import { string } from "joi";
import mongoose, { Schema, Document, Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

// Document interface
export interface IUserAction extends Document {
  id: string;
  user: string; // storing UUID as string
  recipe: string;     // which recipe
  action: "saved" | "shared"; // type of action
}

// Schema definition
const userActionSchema = new Schema<IUserAction>(
  {
    id: { type: String, unique: true, default: uuidv4 },
    user: { type: String, required: true },
    recipe: { type: String, required: true },
    action: { type: String, enum: ["saved", "shared"], required: true },
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

userActionSchema.virtual("recipeData", {
  ref: "Recipe",
  localField: "recipe",   // field in UserAction
  foreignField: "id",     // field in Recipe model (uuid field)
  justOne: true
});

userActionSchema.set("toObject", { virtuals: true });
userActionSchema.set("toJSON", { virtuals: true });

export const UserAction = mongoose.model<IUserAction>("UserAction", userActionSchema);