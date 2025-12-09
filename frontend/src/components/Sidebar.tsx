import {
  BarChart,
  Calendar,
  LayoutDashboard,
  UserCog,
  Users,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "Leads", icon: Users },
    { id: "agents", label: "Agents", icon: UserCog },
    { id: "followups", label: "Follow-Ups", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart },
  ];
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-blue-400 text-xl font-bold">Lead Management</h1>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            A
          </div>
          <div className="flex-1">
            <div className="text-gray-900">Admin User</div>
            <div className="text-gray-500 text-sm">admin@company.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
