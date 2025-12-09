import type { AgentType, LeadType } from "../types";

interface AnalyticsProps {
  leads: LeadType[];
  agents: AgentType[];
}

export const Analytics = ({ leads, agents }: AnalyticsProps) => {
  return <div>Analytics</div>;
};

export default Analytics;
