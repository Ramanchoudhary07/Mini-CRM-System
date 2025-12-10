import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import LeadManagement from "./pages/LeadManagement";
import Analytics from "./pages/Analytics";
import FollowUpManagement from "./pages/FollowUpManagement";
import AgentManagement from "./pages/AgentManagement";
import { Toaster } from "react-hot-toast";
import {
  useLeadStore,
  useAgentStore,
  useFollowUpStore,
  useSidebarStore,
} from "./store";

function App() {
  const activeTab = useSidebarStore((state) => state.activeTab);

  const { fetchLeads } = useLeadStore();
  const { fetchAgents } = useAgentStore();
  const { fetchFollowUps } = useFollowUpStore();

  useEffect(() => {
    fetchLeads();
    fetchAgents();
    fetchFollowUps();
  }, [fetchLeads, fetchAgents, fetchFollowUps]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "leads" && <LeadManagement />}
        {activeTab === "agents" && <AgentManagement />}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "followups" && <FollowUpManagement />}
      </main>

      <Toaster />
    </div>
  );
}

export default App;
