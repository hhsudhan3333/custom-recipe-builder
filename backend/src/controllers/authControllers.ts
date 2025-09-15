import { Request, Response } from "express";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";


const generateToken = (id: string, email: string) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export const registerUser = async (req: Request, res: Response) => {
  const { id, name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ 
        success: false,
        message: "User already exists",
        data: [],
     });
    const id = uuidv4();
    const user = await User.create({ id, name, email, password, role });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user.id, user.email)
        },],
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      message: "Something went wrong",
      data: [], // keep it consistent
      error: err.message,
     });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(200).json({ 
        success: false,
        message: "Invalid email or password",
        data: [],
      });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password",
        data: [],
      });

    res.json({
      success: true,
      data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.email)
      }
      
    });
  } catch (err: any) {
    res.status(500).json({ 
        success: false,
        message: "Something went wrong",
        data: [], 
        error: err.message,
     });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findOne({ id: req.user.id }).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ 
        success: false,
        message: "Something went wrong",
        data: [], 
        error: err.message,
     });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ id: req.user.id });
    if (!user) return res.status(404).json({ 
        success: false,
        message: "User not found",
        data: [],
     });
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (err: any) {
    res.status(500).json({ 
        success: false,
        message: "Something went wrong",
        data: [],
        error: err.message,
     });
  }
};
