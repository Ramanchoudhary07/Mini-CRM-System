import mongoose, { Schema } from "mongoose";
import { LeadStatus, LeadType } from "../types/index";

interface LeadDocument extends LeadType {}

const leadSchema = new Schema<LeadDocument>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
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
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted", "Lost"] as LeadStatus[],
      default: "New",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<LeadDocument>("Lead", leadSchema);
