import { create } from "zustand";

interface SettingsState {
  currency: string;
  language: string;
  setCurrency(currency: string): void;
  setLanguage(language: string): void;
}

const useSettingsStore = create<SettingsState>()((set) => ({
  currency: "Euro",
  language: "Français",
  setLanguage: (language) => set({ language }),
  setCurrency: (currency) => set({ currency }),
}));

export default useSettingsStore;
