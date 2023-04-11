import { create } from "zustand";

interface TabState {
  tab: any;
  setTab: (tab: any) => void;
}

const useTabStore = create<TabState>()((set) => ({
  tab: "Wallet",
  setTab: (tab) => set({ tab }),
}));

export default useTabStore;
