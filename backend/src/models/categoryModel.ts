import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICategory extends Document {
  id: string;   
  name: string;
  slug: string;
}

const categorySchema: Schema<ICategory> = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true  }, 
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
  },
  { timestamps: true, _id: false }
);


categorySchema.set("toJSON", { virtuals: true });
categorySchema.set("toObject", { virtuals: true });

export const Category = mongoose.model<ICategory>("Category", categorySchema);