import { Request, Response } from "express";
import {User} from "../models/userModel";
import { AuthRequest } from "../middlewares/authMiddleware";

// GET
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as unknown as AuthRequest;
  const user = authReq.user;
  try {
    if (!authReq.user || typeof authReq.user === "string") {
      res.status(401).json({ 
          success: false,
          message: "Unauthorized",
          data: [],
       });
      return;
    }
    const { id } = authReq.user as { id: string };

    const user = await User.findOne({ id }).select("-password");
    console.log(user)
    if (!user) {
      res.status(404).json({
          success: false,
          message: "User not found",
          data: [],
      });
      return;
    }

    res.json({
      success: true,
      message: ({ user: "..." }),
      data: user,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
          success: false,
          message: "Server Error",
          data: [],
    });
  }
};

// PUT 
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as unknown as AuthRequest;
  const user = authReq.user;
  console.log("user")
  try {
    if (!authReq.user || typeof authReq.user === "string") {
      res.status(401).json({
          success: false,
          message: "Unauthorized",
          data: [],
      });
      return;
    }

    const { name, password } = authReq.body;

    const user = await User.findOne({ id: authReq.user.id});
  
    if (!user) {
      res.status(404).json({ 
          success: false,
          message: "User not found",
          data: [],
      });
      return;
    }
    if (name) user.name = name;

    if (password) user.password = password; 

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ 
          success: false,
          message: "Server Error",
          data: [],
    });
  }
};

