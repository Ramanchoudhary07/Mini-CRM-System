import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import LeadManagement from "./pages/LeadManagement";
import Analytics from "./pages/Analytics";
import FollowUpManagement from "./pages/FollowUpManagement";
import type { AgentType, FollowUpType, LeadType } from "./types";
import AgentManagement from "./pages/AgentManagement";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [agents, setAgents] = useState<AgentType[]>([]);
  const [followups, setFollowups] = useState<FollowUpType[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const handleAddLead = (lead: LeadType) => {
    const newId = (leads.length + 1).toString();
    lead._id = newId;
    const agent = agents.find((a) => a._id === lead.assignedTo);
    if (agent) {
      agent.totalLeads += 1;
      if (lead.status === "Converted") {
        agent.convertedLeads += 1;
      }
      setAgents((prevAgents) =>
        prevAgents.map((a) => (a._id === agent._id ? { ...agent } : a))
      );
    }
    setLeads((prevLeads) => [...prevLeads, lead]);
    console.log(lead);
  };

  const handleUpdateLead = (_id: string, updatedLead: LeadType) => {
    console.log({ _id, updatedLead });
  };

  const handleDeleteLead = (_id: string) => {
    console.log(_id);
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
    const newId = (agents.length + 1).toString();
    agent._id = newId;
    setAgents((prevAgents) => [...prevAgents, agent]);
    console.log(agent);
  };

  const handleOnUpdateAgent = (id: string, agent: AgentType) => {
    console.log({ id, agent });
  };

  const handleDeleteAgent = (id: string) => {
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
            onDeleteLead={handleDeleteLead}
          />
        )}

        {activeTab === "agents" && (
          <AgentManagement
            agents={agents}
            onAddAgent={handleOnAddAgent}
            onUpdateAgent={handleOnUpdateAgent}
            onDeleteAgent={handleDeleteAgent}
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
