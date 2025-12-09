import type { AgentType } from "../types";

interface AgentManagementProps {
  agents: AgentType[];
  onAddAgent: (agent: AgentType) => void;
  onUpdateAgent: (id: string, agent: AgentType) => void;
}
const AgentManagement = ({}: AgentManagementProps) => {
  return <div>Agents</div>;
};

export default AgentManagement;
