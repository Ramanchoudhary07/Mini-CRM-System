import { Request, Response } from "express";
import { redis } from "../config/redis";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Agent from "../models/Agent";
import bcrypt from "bcryptjs";

dotenv.config();

const generateTokens = (
  agentId: string
): { accessToken: string; refreshToken: string } => {
  const access_secret = process.env.ACCESS_TOKEN_SECRET as string;
  const refresh_secret = process.env.REFRESH_TOKEN_SECRET as string;
  const accessToken = jwt.sign({ agentId }, access_secret, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ agentId }, refresh_secret, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (agentId: string, refreshToken: string) => {
  await redis.set(
    `refreshToken:${agentId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const agentExists = await Agent.findOne({ email });
    if (agentExists)
      return res.status(400).json({ message: "Agent already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const agent = await Agent.create({ name, email, password: hashedPassword });

    const { accessToken, refreshToken } = generateTokens(agent._id);
    await storeRefreshToken(agent._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      role: agent.role,
    });
  } catch (error: any) {
    console.log("error in signing up", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(400).json({ message: "No account by this email" });
    }

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const { accessToken, refreshToken } = generateTokens(agent._id);
    await storeRefreshToken(agent._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
    res.status(200).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      role: agent.role,
    });
  } catch (error: any) {
    console.log("error in logging in", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    await redis.del(`refreshToken:${decoded.agentId}`);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.log("error in logging out", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    const storedToken = await redis.get(`refreshToken:${decoded.agentId}`);
    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const accessToken = jwt.sign(
      { agentId: decoded.agentId },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ message: "token refreshed successfully" });
  } catch (error: any) {
    console.log("error in refreshing token", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    res.json(req.agent);
  } catch (error: any) {
    console.log("error in getting profile", error.message);
    res.status(500).json({ message: error.message });
  }
};
