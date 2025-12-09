import { Edit2, Mail, Phone, Plus, Trash2 } from "lucide-react";
import type { AgentType } from "../types";
import { useState } from "react";
import AddAgentModal from "../components/AddAgentModal";
import { useAgentStore } from "../store";

const AgentManagement = () => {
  const agents = useAgentStore((state) => state.agents);
  const addAgent = useAgentStore((state) => state.addAgent);
  const updateAgent = useAgentStore((state) => state.updateAgent);
  const deleteAgent = useAgentStore((state) => state.deleteAgent);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingAgent, setEditingAgent] = useState<AgentType | null>(null);
  const [formData, setFormData] = useState<AgentType>({
    name: "",
    email: "",
    phone: "",
    totalLeads: 0,
    convertedLeads: 0,
  });

  const handleEdit = (agent: AgentType) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      totalLeads: agent.totalLeads,
      convertedLeads: agent.convertedLeads,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      totalLeads: 0,
      convertedLeads: 0,
    });
    setShowForm(false);
    setEditingAgent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAgent) {
      await updateAgent(editingAgent._id!, formData);
    } else {
      await addAgent(formData);
    }
    resetForm();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-gray-900 mb-2">Agents</h2>
          <p className="text-gray-600">Manage and track all your Agents</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Agent
        </button>
      </div>

      {showForm && (
        <AddAgentModal
          editingAgent={editingAgent}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Agent</th>
                <th className="px-6 py-3 text-left text-gray-700">Contact</th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Total Leads
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Converted Leads
                </th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {agents.map((agent) => {
                return (
                  <tr key={agent._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{agent.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 text-sm flex items-center gap-1 mb-1">
                        <Mail className="w-3 h-3" />
                        {agent.email}
                      </div>
                      <div className="text-gray-600 text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {agent.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-90 px-6">
                        {agent.totalLeads}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 px-6">
                        {agent.convertedLeads}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(agent)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit lead"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAgent(agent._id!)}
                          className="p-2 text-red-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Delete Agent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {agents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No Agent found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentManagement;
