import { create } from "zustand";

interface SidebarStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  activeTab: "dashboard",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
