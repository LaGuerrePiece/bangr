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
        await new Promise((resolve) => setTimeout(resolve, 5000));

        set({ tokens: data });
      } catch (error) {
        console.log("error fetching tokens:", error);
      }
    },

    addBalances: async (balances: Balance[]) => {
      for (let i = 0; i < 10; i++) {
        const { tokens } = get();
        if (tokens) {
          const newTokens = addBalancesToTokens(tokens, balances);
          set({
            tokens: newTokens,
          });
          if (i > 0) console.log("finally added balances after", i, "seconds");
          return;
        }
        console.log(
          "Cannot add balances to no tokens. Waiting for tokens...",
          i
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      console.log("Error: tokens did not arrive after 10 seconds.");
      return;
    },

    addPrices: async (prices: Price[]) => {
      for (let i = 0; i < 10; i++) {
        const { tokens } = get();
        if (tokens) {
          const newTokens = addPricesToTokens(tokens, prices);
          set({
            tokens: newTokens,
          });
          if (i > 0) console.log("finally added prices after", i, "seconds");
          return;
        }
        console.log("Cannot add prices to no tokens. Waiting for tokens...", i);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      console.log("Error: tokens did not arrive after 10 seconds.");
      return;
    },

    clear: () => {
      get().fetchTokensStatic();
    },
  }))
);

export default useTokensStore;
