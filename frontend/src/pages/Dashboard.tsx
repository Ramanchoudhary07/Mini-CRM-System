import { CheckCircle, Clock, TrendingUp, Users } from "lucide-react";
import { useLeadStore, useFollowUpStore } from "../store";

const Dashboard = () => {
  const leads = useLeadStore((state) => state.leads);
  const followups = useFollowUpStore((state) => state.followups);

  const totalLeads = leads.length;
  const convertedLeads = leads.filter((l) => l.status === "Converted").length;
  const conversionRate =
    totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0";
  const pendingFollowUps = followups.filter(
    (f) => !f.isCompleted && new Date(f.followUpDate) >= new Date()
  ).length;

  const stats = [
    {
      label: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Converted",
      value: convertedLeads,
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Pending Follow-ups",
      value: pendingFollowUps,
      icon: Clock,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const recentLeads = leads
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    )
    .slice(0, 5);

  const upcomingFollowUps = followups
    .filter((f) => !f.isCompleted && new Date(f.followUpDate) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime()
    )
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Welcome back! Here&apos;s your sales overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 mb-2">{stat.label}</p>
                  <p className={`${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Recent Leads</h3>
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div
                key={lead._id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1">
                  <div className="text-gray-900">{lead.firstName}</div>
                  <div className="text-gray-500 text-sm">{lead.lastName}</div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
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
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Upcoming Follow-ups</h3>
          <div className="space-y-4">
            {upcomingFollowUps.length > 0 ? (
              upcomingFollowUps.map((followUp) => {
                const lead = leads.find((l) => l._id === followUp.leadId);
                return (
                  <div
                    key={followUp._id}
                    className="py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="text-gray-900">
                        {lead?.firstName || "Unknown Lead"}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {new Date(followUp.followUpDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-gray-600 text-sm">
                      {followUp.notes}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500 text-center py-8">
                No upcoming follow-ups
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
