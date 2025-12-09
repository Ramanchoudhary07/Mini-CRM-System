import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import LeadManagement from "./components/LeadManagement";
import Analytics from "./components/Analytics";
import FollowUpManagement from "./components/FollowUpManagement";
import type { AgentType, FollowUpType, LeadType } from "./types";
import AgentManagement from "./components/AgentManagement";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [agents, setAgents] = useState<AgentType[]>([]);
  const [followups, setFollowups] = useState<FollowUpType[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<LeadType | null>(null);

  const handleAddLead = (lead: LeadType) => {
    setLeads((prevLeads) => [...prevLeads, lead]);
    console.log(lead);
  };

  const handleUpdateLead = (_id: string, updatedLead: LeadType) => {
    console.log({ _id, updatedLead });
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

  const handleOnAddAgent = (agent: AgentType) => {
    console.log(agent);
  };

  const handleOnUpdateAgent = (id: string, agent: AgentType) => {
    console.log({ id, agent });
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

        {activeTab === "agents" && (
          <AgentManagement
            agents={agents}
            onAddAgent={handleOnAddAgent}
            onUpdateAgent={handleOnUpdateAgent}
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
