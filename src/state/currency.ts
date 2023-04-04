import { create } from "zustand";

interface CurrencyState {
  currency: string;
  setCurrency (currency: string) : void;
}

const useCurrencyStore = create<CurrencyState>()((set) => ({
  currency: "Euro",
  setCurrency: (currency) => set({ currency }),
}));

export default useCurrencyStore;
