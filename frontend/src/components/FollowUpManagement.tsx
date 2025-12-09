import type { FollowUpType, LeadType } from "../types";

interface FollowUpManagementProps {
  followups: FollowUpType[];
  leads: LeadType[];
  onAddFollowUp: (followup: FollowUpType) => void;
  onToggleComplete: (id: string) => void;
  selectedLeadId: LeadType | null;
}

const FollowUpManagement = ({}: FollowUpManagementProps) => {
  return <div></div>;
};

export default FollowUpManagement;
