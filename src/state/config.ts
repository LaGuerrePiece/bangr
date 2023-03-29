import { create } from "zustand";

interface ConfigState {
  lightMode: boolean,
  currency: string,
  setLightMode: (lightMode: boolean) => void,
  setcuCurrency: (currency: string) => void,
}

const useConfigStore = create<ConfigState>()((set) => ({
  lightMode: true,
  currency: "USD",
  setLightMode: (lightMode) => set({ lightMode }),
  setcuCurrency: (currency) => set({ currency }),
}));

export default useConfigStore;
