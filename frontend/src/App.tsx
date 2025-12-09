import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import LeadManagement from "./components/LeadManagement";
import Analytics from "./components/Analytics";
import FollowUpManagement from "./components/FollowUpManagement";
import type { AgentType, FollowUpType, LeadType } from "./types";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [agents, setAgents] = useState<AgentType[]>([]);
  const [followups, setFollowups] = useState<FollowUpType[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<LeadType | null>(null);

  const handleAddLead = (lead: LeadType) => {
    console.log(lead);
  };

  const handleUpdateLead = (id: string, updatedLead: LeadType) => {
    console.log({ id, updatedLead });
  };

  const handleOnOpenFollowup = (leadId: string) => {
    console.log(leadId);
  };

  const handleAddFollowUp = (followup: FollowUpType) => {
    console.log(followup);
  };

  const handleToggleComplete = (id: string) => {
    console.log(id);
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        {activeTab === "dashboard" && (
          <Dashboard leads={leads} followups={followups} />
        )}

        {activeTab === "leads" && (
          <LeadManagement
            leads={leads}
            agents={agents}
            onAddLead={handleAddLead}
            onUpdateLead={handleUpdateLead}
            onOpenFollowUp={handleOnOpenFollowup}
          />
        )}

        {activeTab === "analytics" && (
          <Analytics leads={leads} agents={agents} />
        )}

        {activeTab === "followups" && (
          <FollowUpManagement
            followups={followups}
            leads={leads}
            onAddFollowUp={handleAddFollowUp}
            onToggleComplete={handleToggleComplete}
            selectedLeadId={selectedLeadId}
          />
        )}
      </main>
    </div>
  );
}

export default App;
