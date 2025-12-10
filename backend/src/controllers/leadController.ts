import { Request, Response, NextFunction } from "express";
import Lead from "../models/Lead";
import Agent from "../models/Agent";
import { LeadStatus } from "../types";

export const getAllLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, assignedTo, page = 1, limit = 10 } = req.query;
    const skip = ((Number(page) || 1) - 1) * (Number(limit) || 10);
    const filter: any = {};
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name email phone")
      .skip(skip)
      .limit(Number(limit) || 10)
      .sort({ createdAt: -1 });

    const total = await Lead.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: leads,
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

export const getLeadById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id).populate(
      "assignedTo",
      "name email phone"
    );

    if (!lead) {
      res.status(404).json({
        success: false,
        error: "Lead not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, phone, status, assignedTo, notes } =
      req.body.lead;
    if (!firstName || !lastName || !email || !phone) {
      res.status(400).json({
        success: false,
        error: "Missing fields required",
      });
      return;
    }
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      res.status(409).json({
        success: false,
        error: "Lead with this email already exists",
      });
      return;
    }

    const newLead = new Lead({
      firstName,
      lastName,
      email,
      phone,
      status: status || "New",
      assignedTo: assignedTo || null,
      notes: notes || "",
    });

    const savedLead = await newLead.save();

    if (assignedTo) {
      await Agent.findByIdAndUpdate(
        assignedTo,
        { $inc: { totalLeads: 1 } },
        { new: true }
      );
    }

    const populatedLead = await savedLead.populate(
      "assignedTo",
      "_id firstName lastName email phone status assignedTo createdAt updatedAt notes"
    );

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: populatedLead,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, status, assignedTo, notes } =
      req.body.lead;

    const lead = await Lead.findById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        error: "Lead not found",
      });
      return;
    }

    if (email && email !== lead.email) {
      const existingLead = await Lead.findOne({ email });
      if (existingLead) {
        res.status(409).json({
          success: false,
          error: "Email already in use by another lead",
        });
        return;
      }
    }

    if (firstName) lead.firstName = firstName;
    if (lastName) lead.lastName = lastName;
    if (email) lead.email = email;
    if (phone) lead.phone = phone;

    const oldStatus = lead.status;
    const oldAssignedTo = lead.assignedTo;

    if (status) {
      lead.status = status as LeadStatus;
      if (
        oldStatus !== "Converted" &&
        status === "Converted" &&
        oldAssignedTo
      ) {
        await Agent.findByIdAndUpdate(
          oldAssignedTo,
          { $inc: { convertedLeads: 1 } },
          { new: true }
        );
      }
      if (
        oldStatus === "Converted" &&
        status !== "Converted" &&
        oldAssignedTo
      ) {
        await Agent.findByIdAndUpdate(
          oldAssignedTo,
          { $inc: { convertedLeads: -1 } },
          { new: true }
        );
      }
    }

    if (assignedTo !== "") {
      if (assignedTo !== oldAssignedTo?.toString()) {
        if (oldAssignedTo) {
          await Agent.findByIdAndUpdate(
            oldAssignedTo,
            {
              $inc: {
                totalLeads: -1,
                convertedLeads: lead.status === "Converted" ? -1 : 0,
              },
            },
            { new: true }
          );
        }
        if (assignedTo) {
          await Agent.findByIdAndUpdate(
            assignedTo,
            {
              $inc: {
                totalLeads: 1,
                convertedLeads: lead.status === "Converted" ? 1 : 0,
              },
            },
            { new: true }
          );
        }
        lead.assignedTo = assignedTo;
      }
    }

    if (notes !== "") lead.notes = notes;

    const updatedLead = await lead.save();
    const populatedLead = await updatedLead.populate(
      "assignedTo",
      "_id firstName lastName email phone status assignedTo createdAt updatedAt notes"
    );

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: populatedLead,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        error: "Lead not found",
      });
      return;
    }

    if (lead.assignedTo) {
      const decrement = {
        totalLeads: -1,
        convertedLeads: lead.status === "Converted" ? -1 : 0,
      };
      await Agent.findByIdAndUpdate(
        lead.assignedTo,
        { $inc: decrement },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const assignLeadToAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      res.status(400).json({
        success: false,
        error: "Agent ID is required",
      });
      return;
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        error: "Lead not found",
      });
      return;
    }

    lead.assignedTo = agentId;
    const updatedLead = await lead.save();
    const populatedLead = await updatedLead.populate(
      "assignedTo",
      "name email phone"
    );

    res.status(200).json({
      success: true,
      message: "Lead assigned to agent successfully",
      data: populatedLead,
    });
  } catch (error) {
    next(error);
  }
};

export const changeLeadStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        error: "Status is required",
      });
      return;
    }

    const validStatuses: LeadStatus[] = [
      "New",
      "Contacted",
      "Converted",
      "Lost",
    ];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: `Invalid status`,
      });
      return;
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        error: "Lead not found",
      });
      return;
    }

    lead.status = status;
    const updatedLead = await lead.save();
    const populatedLead = await updatedLead.populate(
      "assignedTo",
      "name email phone"
    );

    res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: populatedLead,
    });
  } catch (error) {
    next(error);
  }
};
