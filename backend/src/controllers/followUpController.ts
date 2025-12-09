import { Request, Response, NextFunction } from "express";
import FollowUp from "../models/FollowUp";
import Lead from "../models/Lead";

export const getAllFollowUps = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { agentId, isCompleted, page = 1, limit = 10 } = req.query;
    const skip = ((Number(page) || 1) - 1) * (Number(limit) || 10);

    const filter: any = {};
    if (agentId) filter.agentId = agentId;
    if (isCompleted !== undefined) filter.isCompleted = isCompleted === "true";

    const followUps = await FollowUp.find(filter)
      .populate("leadId", "firstName lastName email company")
      .populate("agentId", "name email phone")
      .skip(skip)
      .limit(Number(limit) || 10)
      .sort({ followUpDate: 1 });

    const total = await FollowUp.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: followUps,
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

export const getFollowUpById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const followUp = await FollowUp.findById(id)
      .populate("leadId", "firstName lastName email company")
      .populate("agentId", "name email phone");

    if (!followUp) {
      res.status(404).json({
        success: false,
        error: "Follow-up not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: followUp,
    });
  } catch (error) {
    next(error);
  }
};

export const createFollowUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { leadId, agentId, notes, followUpDate } = req.body;

    // Validation
    if (!leadId || !agentId || !notes || !followUpDate) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: leadId, agentId, notes, followUpDate",
      });
      return;
    }

    // Verify lead exists
    const lead = await Lead.findById(leadId);
    if (!lead) {
      res.status(404).json({
        success: false,
        error: "Lead not found",
      });
      return;
    }

    const newFollowUp = new FollowUp({
      leadId,
      agentId,
      notes,
      followUpDate: new Date(followUpDate),
      isCompleted: false,
    });

    const savedFollowUp = await newFollowUp.save();
    const populatedFollowUp = await (
      await savedFollowUp.populate("leadId", "firstName lastName email company")
    ).populate("agentId", "name email phone");

    res.status(201).json({
      success: true,
      message: "Follow-up created successfully",
      data: populatedFollowUp,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFollowUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes, followUpDate, isCompleted } = req.body;

    const followUp = await FollowUp.findById(id);

    if (!followUp) {
      res.status(404).json({
        success: false,
        error: "Follow-up not found",
      });
      return;
    }

    // Update fields
    if (notes) followUp.notes = notes;
    if (followUpDate) followUp.followUpDate = new Date(followUpDate);
    if (isCompleted !== undefined) followUp.isCompleted = isCompleted;

    const updatedFollowUp = await followUp.save();
    const populatedFollowUp = await (
      await updatedFollowUp.populate(
        "leadId",
        "firstName lastName email company"
      )
    ).populate("agentId", "name email phone");

    res.status(200).json({
      success: true,
      message: "Follow-up updated successfully",
      data: populatedFollowUp,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFollowUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const followUp = await FollowUp.findByIdAndDelete(id);

    if (!followUp) {
      res.status(404).json({
        success: false,
        error: "Follow-up not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Follow-up deleted successfully",
      data: followUp,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingFollowUps = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { agentId } = req.query;

    const filter: any = {
      isCompleted: false,
      followUpDate: { $lte: new Date() },
    };

    if (agentId) filter.agentId = agentId;

    const pendingFollowUps = await FollowUp.find(filter)
      .populate("leadId", "firstName lastName email company")
      .populate("agentId", "name email phone")
      .sort({ followUpDate: 1 });

    res.status(200).json({
      success: true,
      data: pendingFollowUps,
      count: pendingFollowUps.length,
    });
  } catch (error) {
    next(error);
  }
};

export const markFollowUpAsCompleted = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const followUp = await FollowUp.findById(id);

    if (!followUp) {
      res.status(404).json({
        success: false,
        error: "Follow-up not found",
      });
      return;
    }

    followUp.isCompleted = true;
    const updatedFollowUp = await followUp.save();
    const populatedFollowUp = await (
      await updatedFollowUp.populate(
        "leadId",
        "firstName lastName email company"
      )
    ).populate("agentId", "name email phone");

    res.status(200).json({
      success: true,
      message: "Follow-up marked as completed",
      data: populatedFollowUp,
    });
  } catch (error) {
    next(error);
  }
};
