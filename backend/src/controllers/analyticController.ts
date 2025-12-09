import { Request, Response, NextFunction } from "express";
import Lead from "../models/Lead";
import FollowUp from "../models/FollowUp";

export const getAnalyticsSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalLeads = await Lead.countDocuments();

    const leadsByStatus = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {
      New: 0,
      Contacted: 0,
      Converted: 0,
      Lost: 0,
    };

    leadsByStatus.forEach((item) => {
      statusCounts[item._id as keyof typeof statusCounts] = item.count;
    });

    const conversionPercentage =
      totalLeads > 0
        ? ((statusCounts.Converted / totalLeads) * 100).toFixed(2)
        : "0.00";

    const totalFollowUps = await FollowUp.countDocuments();
    const completedFollowUps = await FollowUp.countDocuments({
      isCompleted: true,
    });
    const pendingFollowUps = totalFollowUps - completedFollowUps;

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        leadsByStatus: statusCounts,
        conversionPercentage: `${conversionPercentage}%`,
        followUpStats: {
          total: totalFollowUps,
          completed: completedFollowUps,
          pending: pendingFollowUps,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAgentsPerformance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { agentId } = req.params;

    if (!agentId) {
      res.status(400).json({
        success: false,
        message: "agentId is required",
      });
      return;
    }

    const totalLeads = await Lead.countDocuments({ assignedTo: agentId });

    const leadsByStatus = await Lead.aggregate([
      { $match: { assignedTo: { $oid: agentId } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {
      New: 0,
      Contacted: 0,
      Converted: 0,
      Lost: 0,
    };

    leadsByStatus.forEach((item) => {
      statusCounts[item._id as keyof typeof statusCounts] = item.count;
    });

    const conversionPercentage =
      totalLeads > 0
        ? ((statusCounts.Converted / totalLeads) * 100).toFixed(2)
        : "0.00";

    const totalFollowUps = await FollowUp.countDocuments({ agentId });
    const completedFollowUps = await FollowUp.countDocuments({
      agentId,
      isCompleted: true,
    });

    res.status(200).json({
      success: true,
      data: {
        agentId,
        totalLeads,
        leadsByStatus: statusCounts,
        conversionPercentage: `${conversionPercentage}%`,
        followUpStats: {
          total: totalFollowUps,
          completed: completedFollowUps,
          pending: totalFollowUps - completedFollowUps,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAgentAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};

export const getMonthlyPerformance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};
