import type { AgentType } from "../types/index";
import { AgentRole } from "../types/index";
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
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 character long"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["agent", "admin"] as AgentRole[],
      default: "agent",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AgentDocument>("Agent", agentSchema);
