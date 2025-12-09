import type { AgentType } from "../types/index";
import mongoose, { Schema } from "mongoose";

interface AgentDocument extends AgentType {}

const agentSchema = new Schema<AgentDocument>(
  {
    name: {
      type: String,
      required: [true, "Agent name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    totalLeads: {
      type: Number,
      default: 0,
    },
    convertedLeads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AgentDocument>("Agent", agentSchema);
