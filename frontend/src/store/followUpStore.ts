import { create } from "zustand";
import type { FollowUpType } from "../types";
import axios from "../lib/axios";
import toast from "react-hot-toast";

interface FollowUpStore {
  followups: FollowUpType[];
  loading: boolean;
  error: string | null;
  selectedLeadId: string | null;

  setFollowUps: (followups: FollowUpType[]) => void;
  setSelectedLeadId: (id: string | null) => void;
  fetchFollowUps: () => Promise<void>;
  addFollowUp: (followup: FollowUpType) => Promise<void>;
  updateFollowUp: (id: string, followup: FollowUpType) => Promise<void>;
  deleteFollowUp: (id: string) => Promise<void>;
  toggleFollowUpComplete: (id: string) => Promise<void>;
}

export const useFollowUpStore = create<FollowUpStore>((set, get) => ({
  followups: [],
  loading: false,
  error: null,
  selectedLeadId: null,

  setFollowUps: (followups) => set({ followups }),

  setSelectedLeadId: (id) => set({ selectedLeadId: id }),

  fetchFollowUps: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/follow-ups");
      set({ followups: response.data.data || [], loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch follow-ups";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  addFollowUp: async (followup) => {
    try {
      const response = await axios.post("/follow-ups", { followup });

      const { followups } = get();
      set({ followups: [...followups, response.data.data] });
      toast.success(response.data.message || "Follow-up added successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add follow-up";
      toast.error(errorMessage);
    }
  },

  updateFollowUp: async (id, followup) => {
    try {
      const response = await axios.put(`/follow-ups/${id}`, { followup });
      const { followups } = get();
      set({
        followups: followups.map((f) =>
          f._id === id ? response.data.data : f
        ),
      });
      toast.success(response.data.message || "Follow-up updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update follow-up";
      toast.error(errorMessage);
    }
  },

  deleteFollowUp: async (id) => {
    try {
      const response = await axios.delete(`/follow-ups/${id}`);
      const { followups } = get();
      set({ followups: followups.filter((f) => f._id !== id) });
      toast.success(response.data.message || "Follow-up deleted successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete follow-up";
      toast.error(errorMessage);
    }
  },

  toggleFollowUpComplete: async (id) => {
    try {
      const { followups } = get();
      const followup = followups.find((f) => f._id === id);
      if (!followup) return;

      const response = await axios.put(`/follow-ups/${id}`, {
        followup: { ...followup, isCompleted: !followup.isCompleted },
      });
      set({
        followups: followups.map((f) =>
          f._id === id ? response.data.data : f
        ),
      });
      toast.success(
        response.data.message || "Follow-up status updated successfully"
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update follow-up";
      toast.error(errorMessage);
    }
  },
}));
