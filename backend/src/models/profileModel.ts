import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
}
const userSchema: Schema<IUser> = new Schema(
  {
    id: { type: String, unique: true, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
export const User = mongoose.model<IUser>("User", userSchema);
