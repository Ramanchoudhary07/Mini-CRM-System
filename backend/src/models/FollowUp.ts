import mongoose, { Schema, Document } from "mongoose";
import { FollowUpType } from "../types/index.js";

interface FollowUpDocument extends FollowUpType {}

const followUpSchema = new Schema<FollowUpDocument>(
  {
    leadId: {
      type: String,
      ref: "Lead",
      required: [true, "Lead ID is required"],
    },
    agentId: {
      type: String,
      ref: "Agent",
      required: [true, "Agent ID is required"],
    },
    notes: {
      type: String,
      required: [true, "Notes are required"],
      trim: true,
    },
    followUpDate: {
      type: Date,
      required: [true, "Follow-up date is required"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying of pending follow-ups
followUpSchema.index({ isCompleted: 1, followUpDate: 1 });
followUpSchema.index({ agentId: 1, followUpDate: 1 });

export default mongoose.model<FollowUpDocument>("FollowUp", followUpSchema);
