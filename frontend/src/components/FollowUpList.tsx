import { Calendar, CheckCircle, Clock } from "lucide-react";
import type { FollowUpType, LeadType } from "../types";

interface FollowUpListProps {
  followups: FollowUpType[];
  leads: LeadType[];
  title: string;
  icon: React.ReactNode;
  emptyMessage: string;
  onToggleComplete: (id: string) => void;
}

const FollowUpList = ({
  emptyMessage,
  followups,
  icon,
  title,
  leads,
  onToggleComplete,
}: FollowUpListProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-gray-900">{title}</h3>
        <span className="ml-auto bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
          {followups.length}
        </span>
      </div>

      {followups.length > 0 ? (
        <div className="space-y-3">
          {followups.map((followUp) => {
            const leadId =
              typeof followUp.leadId === "string"
                ? followUp.leadId
                : (followUp.leadId as any)?._id;
            const lead = leads.find((l) => l._id === leadId);
            const date = new Date(followUp.followUpDate);

            return (
              <div
                key={followUp._id}
                className={`p-4 rounded-lg border ${
                  followUp.isCompleted
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => onToggleComplete(followUp._id!)}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        followUp.isCompleted
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300 hover:border-green-600"
                      }`}
                    >
                      {followUp.isCompleted && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div
                        className={`text-gray-900 mb-1 ${
                          followUp.isCompleted
                            ? "line-through text-gray-500"
                            : ""
                        }`}
                      >
                        {lead?.firstName || "Unknown Lead"}
                      </div>
                      <div className="text-gray-600 text-sm mb-2">
                        {followUp.notes}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span
                          className={`flex items-center gap-1 text-gray-500`}
                        >
                          <Calendar className="w-4 h-4" />
                          {date.toLocaleDateString()}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {lead && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              lead.status === "New"
                                ? "bg-blue-100 text-blue-700"
                                : lead.status === "Contacted"
                                ? "bg-yellow-100 text-yellow-700"
                                : lead.status === "Converted"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {lead.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      )}
    </div>
  );
};

export default FollowUpList;
