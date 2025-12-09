import { create } from "zustand";
import type { AgentType, LeadType } from "../types";
import axios from "../lib/axios";
import toast from "react-hot-toast";

interface Analytics {
  totalLeads: number;
  totalAgents: number;
  convertedLeads: number;
  conversionRate: string;
  pendingFollowUps: number;
  topAgents: AgentType[];
}

interface AnalyticsStore {
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;

  fetchAnalytics: (leads: LeadType[], agents: AgentType[]) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  analytics: null,
  loading: false,
  error: null,

  fetchAnalytics: async (leads, agents) => {
    set({ loading: true, error: null });
    try {
      const totalLeads = leads.length;
      const convertedLeads = leads.filter(
        (l) => l.status === "Converted"
      ).length;
      const conversionRate =
        totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0";
      const topAgents = agents
        .sort((a, b) => b.convertedLeads - a.convertedLeads)
        .slice(0, 5);

      const followupsResponse = await axios.get("/follow-ups");
      const followups = followupsResponse.data.data || [];
      const pendingFollowUps = followups.filter(
        (f: any) => !f.isCompleted && new Date(f.followUpDate) >= new Date()
      ).length;

      set({
        analytics: {
          totalLeads,
          totalAgents: agents.length,
          convertedLeads,
          conversionRate,
          pendingFollowUps,
          topAgents,
        },
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch analytics";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
}));
