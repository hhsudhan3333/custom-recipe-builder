import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export interface AuthRequest extends Request {
  user?: any;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest; 
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    console.log("Decoded Token:", decoded);   
    authReq.user = decoded; 
    console.log("Req User after setting:", authReq.user);  
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
