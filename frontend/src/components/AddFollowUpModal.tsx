import type { FollowUpType, LeadType } from "../types";

interface AddFollowUpModalProps {
  leads: LeadType[];
  formData: FollowUpType;
  setFormData: React.Dispatch<React.SetStateAction<FollowUpType>>;
  handleSubmit: (e: React.FormEvent) => void;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddFollowUpModal = ({
  leads,
  formData,
  handleSubmit,
  setFormData,
  setShowForm,
}: AddFollowUpModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Schedule Follow-up</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Lead *</label>
            <select
              required
              value={formData.leadId}
              onChange={(e) => {
                const selectedLeadId = e.target.value;
                const selectedLead = leads.find(
                  (lead) => lead._id === selectedLeadId
                );
                const agentId =
                  typeof selectedLead?.assignedTo === "string"
                    ? selectedLead.assignedTo
                    : (selectedLead?.assignedTo as any)?._id || "";

                setFormData({
                  ...formData,
                  leadId: selectedLeadId,
                  agentId: agentId,
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a lead...</option>
              {leads.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.firstName} - {lead.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={formData.followUpDate.toString().slice(0, 16)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  followUpDate: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Notes *</label>
            <textarea
              required
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="What do you need to follow up on?"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Schedule
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  leadId: "",
                  agentId: "",
                  followUpDate: "",
                  notes: "",
                  isCompleted: false,
                });
                setShowForm(false);
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFollowUpModal;
