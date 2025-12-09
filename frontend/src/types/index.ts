export type LeadStatus = "New" | "Contacted" | "Converted" | "Lost";

export interface AgentType {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface LeadType {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: LeadStatus;
  assignedTo?: string;
  notes: string;
}

export interface FollowUpType {
  _id?: string;
  leadId: string;
  agentId: string;
  notes: string;
  followUpDate: Date;
  isCompleted: boolean;
}

export interface AnalyticsType {
  agentId: string;
  totalLeads: number;
  convertedLeads: number;
  conversionPercentage: number;
  lostLeads: number;
  contactedLeads: number;
  newLeads: number;
}
