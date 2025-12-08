import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Agent from "../models/Agent";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      agent?: any;
    }
  }
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      console.log("no access token");
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as { agentId: string };
    const agent = await Agent.findById(decoded.agentId).select("-password");
    if (!agent) {
      console.log("no agent found");
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.agent = agent;
    next();
  } catch (error: any) {
    console.log("error in protectRoute middleware", error);
    res.status(500).json({ message: error.message });
  }
};
