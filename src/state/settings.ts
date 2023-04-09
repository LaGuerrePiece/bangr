import { create } from "zustand";

interface SettingsState {
  currency: string;
  setCurrency(currency: string): void;
}

const useSettingsStore = create<SettingsState>()((set) => ({
  currency: "Euro",
  setCurrency: (currency) => set({ currency }),
}));

export default useSettingsStore;
