import { create } from "zustand";
import { Balances, MultichainToken, Token } from "../types/types";
import { getURL } from "../config/configs";
import axios from "axios";
import { devtools } from "zustand/middleware";
import { getURLInApp } from "../utils/utils";
import { addBalancesToTokens } from "../utils/utils";
// import useSwapStore from "./swap";

interface BalanceState {
  tokens: MultichainToken[] | undefined;
  addBalances: (balances: Balances[]) => void;
  fetchTokensStatic: () => void;
  // getToken: (tokenSymbol: string) => MultichainToken | undefined;
  clear: () => void;
}

const useTokensStore = create<BalanceState>()(
  devtools((set, get) => ({
    tokens: undefined,

    fetchTokensStatic: async () => {
      try {
        const { data } = (await axios.get(`${getURLInApp()}/api/tokens`)) as {
          data: MultichainToken[];
        };
        console.log(`fetched ${data.length} tokens`);
        set({ tokens: data });
      } catch (error) {
        console.log("error fetching tokens:", error);
      }
    },

    addBalances: async (balances: Balances[]) => {
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

    clear: () => {
      get().fetchTokensStatic();
    },
  }))
);

export default useTokensStore;
