import { useState } from "react";
import type { FollowUpType } from "../types";
import { Calendar, CheckCircle, Plus } from "lucide-react";
import AddFollowUpModal from "../components/AddFollowUpModal";
import FollowUpList from "../components/FollowUpList";
import { useFollowUpStore, useLeadStore } from "../store";

const FollowUpManagement = () => {
  const followups = useFollowUpStore((state) => state.followups);
  const selectedLeadId = useFollowUpStore((state) => state.selectedLeadId);
  const addFollowUp = useFollowUpStore((state) => state.addFollowUp);
  const toggleFollowUpComplete = useFollowUpStore(
    (state) => state.toggleFollowUpComplete
  );

  const leads = useLeadStore((state) => state.leads);

  const [showForm, setShowForm] = useState<boolean>(selectedLeadId !== null);
  const [formData, setFormData] = useState<FollowUpType>(() => {
    const selectedLead = leads.find((lead) => lead._id === selectedLeadId);
    const agentId =
      typeof selectedLead?.assignedTo === "string"
        ? selectedLead.assignedTo
        : (selectedLead?.assignedTo as any)?._id || "";

    return {
      leadId: selectedLeadId || "",
      agentId: agentId,
      followUpDate: "",
      notes: "",
      isCompleted: false,
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addFollowUp({
      leadId: formData.leadId,
      agentId: formData.agentId,
      followUpDate: new Date(formData.followUpDate).toISOString(),
      notes: formData.notes,
      isCompleted: false,
    });
    setFormData({
      leadId: "",
      agentId: "",
      followUpDate: "",
      notes: "",
      isCompleted: false,
    });
    setShowForm(false);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const categorizedFollowUps = {
    upcoming: followups.filter(
      (f) => !f.isCompleted && new Date(f.followUpDate) > today
    ),
    completed: followups.filter((f) => f.isCompleted),
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-gray-900 mb-2">Follow-up Manager</h2>
          <p className="text-gray-600">Schedule and track lead follow-ups</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Follow-up
        </button>
      </div>

      {showForm && (
        <AddFollowUpModal
          formData={formData}
          handleSubmit={handleSubmit}
          leads={leads}
          setFormData={setFormData}
          setShowForm={setShowForm}
        />
      )}

      <FollowUpList
        emptyMessage="No upcoming follow-ups"
        followups={categorizedFollowUps.upcoming}
        icon={<Calendar className="w-5 h-5 text-blue-600" />}
        leads={leads}
        onToggleComplete={toggleFollowUpComplete}
        title="Upcoming"
      />
      <FollowUpList
        emptyMessage="No completed follow-ups"
        followups={categorizedFollowUps.completed}
        icon={<CheckCircle className="w-5 h-5 text-green-600" />}
        leads={leads}
        onToggleComplete={toggleFollowUpComplete}
        title="Completed"
      />
    </div>
  );
};

export default FollowUpManagement;
