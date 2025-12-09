import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AgentType, LeadType } from "../types";

interface AnalyticsProps {
  leads: LeadType[];
  agents: AgentType[];
}

export const Analytics = ({ leads, agents }: AnalyticsProps) => {
  // Leads per agent
  const leadsPerAgent = agents.map((agent) => ({
    name: agent.name,
    total: leads.filter((l) => l.assignedTo === agent._id).length,
    converted: leads.filter(
      (l) => l.assignedTo === agent._id && l.status === "Converted"
    ).length,
    contacted: leads.filter(
      (l) => l.assignedTo === agent._id && l.status === "Contacted"
    ).length,
    new: leads.filter((l) => l.assignedTo === agent._id && l.status === "New")
      .length,
  }));

  // Conversion rate per agent
  const conversionPerAgent = agents.map((agent) => {
    const agentLeads = leads.filter((l) => l.assignedTo === agent._id);
    const converted = agentLeads.filter((l) => l.status === "Converted").length;
    const rate =
      agentLeads.length > 0
        ? ((converted / agentLeads.length) * 100).toFixed(1)
        : "0";
    return {
      name: agent.name,
      rate: parseFloat(rate),
    };
  });

  const getMonthlyData = () => {
    const monthlyStats = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();

      const monthLeads = leads.filter((lead) => {
        const leadDate = new Date(lead.createdAt!);
        return (
          leadDate.getMonth() === date.getMonth() &&
          leadDate.getFullYear() === date.getFullYear()
        );
      });

      monthlyStats.push({
        month: `${monthName} ${year}`,
        total: monthLeads.length,
        converted: monthLeads.filter((l) => l.status === "Converted").length,
        contacted: monthLeads.filter((l) => l.status === "Contacted").length,
      });
    }

    return monthlyStats;
  };

  const monthlyData = getMonthlyData();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">
          Detailed insights and performance metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-600 mb-2">Total Agents</div>
          <div className="text-green-600">{agents.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-600 mb-2">Total Leads</div>
          <div className="text-blue-600">{leads.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-600 mb-2">Converted Leads</div>
          <div className="text-purple-600">
            {leads.filter((l) => l.status === "Converted").length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-600 mb-2">Convertion rate</div>
          <div className="text-orange-600">
            {leads.length === 0
              ? "0%"
              : `${Math.round(
                  (leads.filter((l) => l.status === "Converted").length /
                    leads.length) *
                    100
                )}%`}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Leads per Agent */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Leads per Agent </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadsPerAgent}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="new" fill="#3b82f6" name="New" stackId="a" />
              <Bar
                dataKey="contacted"
                fill="#f59e0b"
                name="Contacted"
                stackId="a"
              />
              <Bar
                dataKey="converted"
                fill="#10b981"
                name="Converted"
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rate per Agent */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Conversion Rate by Agent</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionPerAgent}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="rate" fill="#8b5cf6" name="Conversion Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Monthly Performance Summary</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                name="Total Leads"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="contacted"
                stroke="#f59e0b"
                name="Contacted"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="converted"
                stroke="#10b981"
                name="Converted"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Performance Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h3 className="text-gray-900 mb-4">Agent Performance Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Agent</th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Total Leads
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Converted
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Conversion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {agents.map((agent) => {
                  const agentLeads = leads.filter(
                    (l) => l.assignedTo === agent._id
                  );
                  const converted = agentLeads.filter(
                    (l) => l.status === "Converted"
                  ).length;
                  const rate =
                    agentLeads.length > 0
                      ? ((converted / agentLeads.length) * 100).toFixed(1)
                      : "0";

                  return (
                    <tr key={agent._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white">
                            {agent.name.charAt(0)}
                          </div>
                          <div className="text-gray-900">{agent.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {agentLeads.length}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{converted}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            parseFloat(rate) >= 30
                              ? "bg-green-100 text-green-700"
                              : parseFloat(rate) >= 15
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
