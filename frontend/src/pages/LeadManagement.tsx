import {
  Building2,
  Calendar,
  Edit2,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { LeadStatus, LeadType } from "../types";
import { useState } from "react";
import AddLeadModal from "../components/AddLeadModal";
import { useLeadStore, useAgentStore } from "../store";

const LeadManagement = () => {
  const leads = useLeadStore((state) => state.leads);
  const addLead = useLeadStore((state) => state.addLead);
  const updateLead = useLeadStore((state) => state.updateLead);
  const deleteLead = useLeadStore((state) => state.deleteLead);
  const setSelectedLeadId = useLeadStore((state) => state.setSelectedLeadId);

  const agents = useAgentStore((state) => state.agents);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchField, setSearchField] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "All">("All");
  const [filterAgent, setFilterAgent] = useState<string>("All");
  const [editingLead, setEditingLead] = useState<LeadType | null>(null);
  const [formData, setFormData] = useState<LeadType>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "New" as LeadStatus,
    assignedTo: agents[0]?._id || "",
    notes: "",
  });

  const handleEdit = (lead: LeadType) => {
    setEditingLead(lead);
    const agentId =
      typeof lead.assignedTo === "string"
        ? lead.assignedTo
        : (lead.assignedTo as any)?._id || "";

    setFormData({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      assignedTo: agentId,
      notes: lead.notes,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "New",
      assignedTo: agents[0]._id || "",
      notes: "",
    });
    setShowForm(false);
    setEditingLead(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      await updateLead(editingLead._id!, formData);
    } else {
      await addLead(formData);
    }
    resetForm();
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.firstName.toLowerCase().includes(searchField.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchField.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchField.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || lead.status === filterStatus;
    const matchesAgent =
      filterAgent === "All" || lead.assignedTo === filterAgent;
    return matchesSearch && matchesStatus && matchesAgent;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-gray-900 mb-2">Lead Management</h2>
          <p className="text-gray-600">Manage and track all your leads</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Lead
        </button>
      </div>

      {showForm && (
        <AddLeadModal
          editingLead={editingLead}
          formData={formData}
          agents={agents}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as LeadStatus | "All")
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>

              <select
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Agents</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Lead</th>
                <th className="px-6 py-3 text-left text-gray-700">Contact</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => {
                const agentId =
                  typeof lead.assignedTo === "string"
                    ? lead.assignedTo
                    : (lead.assignedTo as any)?._id || "";
                const agent = agents.find((a) => a._id === agentId);
                return (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{lead.firstName}</div>
                      <div className="text-gray-500 text-sm flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {lead.firstName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 text-sm flex items-center gap-1 mb-1">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </div>
                      <div className="text-gray-600 text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateLead(lead._id!, {
                            ...lead,
                            status: e.target.value as LeadStatus,
                          })
                        }
                        className={`px-3 py-1 rounded-full text-sm border-0 cursor-pointer ${
                          lead.status === "New"
                            ? "bg-blue-100 text-blue-700"
                            : lead.status === "Contacted"
                            ? "bg-yellow-100 text-yellow-700"
                            : lead.status === "Converted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-sm">
                          {agent?.name.charAt(0)}
                        </div>
                        <div className="text-gray-700">{agent?.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(lead)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit lead"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteLead(lead._id!)}
                          className="p-2 text-red-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Delete lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedLeadId(lead._id!)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Add follow-up"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No leads found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadManagement;
