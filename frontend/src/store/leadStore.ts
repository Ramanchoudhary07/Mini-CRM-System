import { create } from "zustand";
import type { LeadType } from "../types";
import axios from "../lib/axios";
import toast from "react-hot-toast";

interface LeadStore {
  leads: LeadType[];
  loading: boolean;
  error: string | null;
  selectedLeadId: string | null;

  setLeads: (leads: LeadType[]) => void;
  setSelectedLeadId: (id: string | null) => void;
  fetchLeads: () => Promise<void>;
  addLead: (lead: LeadType) => Promise<void>;
  updateLead: (id: string, lead: LeadType) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

export const useLeadStore = create<LeadStore>((set, get) => ({
  leads: [],
  loading: false,
  error: null,
  selectedLeadId: null,

  setLeads: (leads) => set({ leads }),

  setSelectedLeadId: (id) => set({ selectedLeadId: id }),

  fetchLeads: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/leads");
      set({ leads: response.data.data || [], loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch leads";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  addLead: async (lead) => {
    try {
      const response = await axios.post("/leads", { lead });
      const { leads } = get();
      set({ leads: [...leads, response.data.data] });
      toast.success(response.data.message || "Lead added successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add lead";
      toast.error(errorMessage);
    }
  },

  updateLead: async (id, lead) => {
    try {
      const response = await axios.put(`/leads/${id}`, { lead });
      const { leads } = get();
      set({
        leads: leads.map((l) => (l._id === id ? response.data.data : l)),
      });
      toast.success(response.data.message || "Lead updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update lead";
      toast.error(errorMessage);
    }
  },

  deleteLead: async (id) => {
    try {
      const response = await axios.delete(`/leads/${id}`);
      const { leads } = get();
      set({ leads: leads.filter((l) => l._id !== id) });
      toast.success(response.data.message || "Lead deleted successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete lead";
      toast.error(errorMessage);
    }
  },
}));
