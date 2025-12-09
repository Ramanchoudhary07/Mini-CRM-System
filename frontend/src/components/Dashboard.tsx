import type { FollowUpType, LeadType } from "../types";

interface DashboardProps {
  leads: LeadType[];
  followups: FollowUpType[];
}

const Dashboard = ({ leads, followups }: DashboardProps) => {
  return <div>Dashboard</div>;
};

export default Dashboard;
