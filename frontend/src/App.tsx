import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import LeadManagement from "./pages/LeadManagement";
import Analytics from "./pages/Analytics";
import FollowUpManagement from "./pages/FollowUpManagement";
import type { AgentType, FollowUpType, LeadType } from "./types";
import AgentManagement from "./pages/AgentManagement";
import toast, { Toaster } from "react-hot-toast";
import axios from "./lib/axios";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [agents, setAgents] = useState<AgentType[]>([]);
  const [followups, setFollowups] = useState<FollowUpType[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const handleAddLead = async (lead: LeadType) => {
    useEffect(() => {
      try {
        const res = await axios.post(`/leads`, { lead });
        setLeads((prevLeads) => [...prevLeads, res.data.data]);
        toast.success(res.data.message || "Lead added successfully");
      } catch (error) {
        toast.error("Failed to add lead");
      }
    }, []);
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

      <Toaster />
    </div>
  );
}

export default App;
