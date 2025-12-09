import { Request, Response, NextFunction } from "express";
import Agent from "../models/Agent";

export const getAllAgents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = ((Number(page) || 1) - 1) * (Number(limit) || 10);

    const agents = await Agent.find()
      .skip(skip)
      .limit(Number(limit) || 10)
      .sort({ createdAt: -1 });

    const total = await Agent.countDocuments();

    res.status(200).json({
      success: true,
      data: agents,
      pagination: {
        total,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        pages: Math.ceil(total / (Number(limit) || 10)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAgentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const agent = await Agent.findById(id);

    if (!agent) {
      res.status(404).json({
        success: false,
        error: "Agent not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: agent,
    });
  } catch (error) {
    next(error);
  }
};

export const createAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone } = req.body.agent;

    if (!name || !email || !phone) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: name, email, phone",
      });
      return;
    }

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      res.status(409).json({
        success: false,
        error: "Agent with this email already exists",
      });
      return;
    }

    const newAgent = new Agent({
      name,
      email,
      phone,
    });

    const savedAgent = await newAgent.save();

    res.status(201).json({
      success: true,
      message: "Agent created successfully",
      data: savedAgent,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body.agent;

    const agent = await Agent.findById(id);

    if (!agent) {
      res.status(404).json({
        success: false,
        error: "Agent not found",
      });
      return;
    }

    if (email && email !== agent.email) {
      const existingAgent = await Agent.findOne({ email });
      if (existingAgent) {
        res.status(409).json({
          success: false,
          error: "Email already in use by another agent",
        });
        return;
      }
    }

    if (name) agent.name = name;
    if (email) agent.email = email;
    if (phone) agent.phone = phone;

    const updatedAgent = await agent.save();

    res.status(200).json({
      success: true,
      message: "Agent updated successfully",
      data: updatedAgent,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const agent = await Agent.findByIdAndDelete(id);

    if (!agent) {
      res.status(404).json({
        success: false,
        error: "Agent not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Agent deleted successfully",
      data: agent,
    });
  } catch (error) {
    next(error);
  }
};
