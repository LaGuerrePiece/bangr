import { create } from "zustand";
import { Balance, MultichainToken, Price } from "../types/types";
import axios from "axios";
import { devtools } from "zustand/middleware";
import { getURLInApp } from "../utils/utils";
import { addBalancesToTokens, addPricesToTokens } from "../utils/utils";

interface BalanceState {
  tokens: MultichainToken[] | undefined;
  addBalances: (balances: Balance[]) => void;
  addPrices: (prices: Price[]) => void;
  fetchTokensStatic: () => void;
  clear: () => void;
}

const useTokensStore = create<BalanceState>()(
  devtools((set, get) => ({
    tokens: undefined,

    fetchTokensStatic: async () => {
      try {
        const { data } = (await axios.get(
          `${getURLInApp()}/api/v1/tokens`
        )) as {
          data: MultichainToken[];
        };
        console.log(`fetched ${data.length} tokens`);
        set({ tokens: data });
      } catch (error) {
        console.log("error fetching tokens:", error);
      }
    },

    addBalances: async (balances: Balance[]) => {
      const { tokens } = get();

      if (!tokens) {
        console.log("error: cannot add balances to no tokens");
        return;
      }

      const newTokens = addBalancesToTokens(tokens, balances);

      // console.log("newTokens after adding balances:", newTokens);

      set({
        tokens: newTokens,
      });
    },

    addPrices: async (prices: Price[]) => {
      const { tokens } = get();

      if (!tokens) {
        console.log("error: cannot add prices to no tokens");
        return;
      }

      const newTokens = addPricesToTokens(tokens, prices);

      // console.log("newTokens after adding prices:", newTokens);

      set({
        tokens: newTokens,
      });
    },

    clear: () => {
      get().fetchTokensStatic();
    },
  }))
);

export default useTokensStore;
