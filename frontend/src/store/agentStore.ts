import { create } from "zustand";
import type { AgentType } from "../types";
import axios from "../lib/axios";
import toast from "react-hot-toast";

interface AgentStore {
  agents: AgentType[];
  loading: boolean;
  error: string | null;

  setAgents: (agents: AgentType[]) => void;
  fetchAgents: () => Promise<void>;
  addAgent: (agent: AgentType) => Promise<void>;
  updateAgent: (id: string, agent: AgentType) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: [],
  loading: false,
  error: null,

  setAgents: (agents) => set({ agents }),

  fetchAgents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/agents");
      set({ agents: response.data.data || [], loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch agents";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  addAgent: async (agent) => {
    try {
      const response = await axios.post("/agents", { agent });
      const { agents } = get();
      set({ agents: [...agents, response.data.data] });
      toast.success(response.data.message || "Agent added successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add agent";
      toast.error(errorMessage);
    }
  },

  updateAgent: async (id, agent) => {
    try {
      const response = await axios.put(`/agents/${id}`, { agent });
      const { agents } = get();
      set({
        agents: agents.map((a) => (a._id === id ? response.data.data : a)),
      });
      toast.success(response.data.message || "Agent updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update agent";
      toast.error(errorMessage);
    }
  },

  deleteAgent: async (id) => {
    try {
      const response = await axios.delete(`/agents/${id}`);
      const { agents } = get();
      set({ agents: agents.filter((a) => a._id !== id) });
      toast.success(response.data.message || "Agent deleted successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete agent";
      toast.error(errorMessage);
    }
  },
}));
