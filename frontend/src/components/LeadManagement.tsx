import type { AgentType, LeadType } from "../types";

interface LeadManagementProps {
  leads: LeadType[];
  agents: AgentType[];
  onAddLead: (lead: LeadType) => void;
  onUpdateLead: (id: string, lead: LeadType) => void;
  onOpenFollowUp: (leadId: string) => void;
}

const LeadManagement = ({
  leads,
  agents,
  onAddLead,
  onUpdateLead,
  onOpenFollowUp,
}: LeadManagementProps) => {
  return <div>Leads</div>;
};

export default LeadManagement;
