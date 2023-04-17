import { create } from "zustand";
import "@ethersproject/shims";
import { Wallet } from "ethers";
import { getSmartWalletAddress } from "../utils/utils";
import axios from "axios";
import { getURLInApp } from "../utils/utils";
import { Balance, Price } from "../types/types";
import useTokensStore from "./tokens";
import useVaultsStore from "./vaults";

interface UserState {
  wallet: Wallet | undefined;
  smartWalletAddress: string | undefined;
  loaded: number | undefined;
  login: (wallet: Wallet) => Promise<void>;
  fetchBalances: (
    scwAddress?: string | null,
    getPrices?: boolean
  ) => Promise<void>;
  fetchPrices: () => Promise<void>;
  setLoaded: (loaded: number | undefined) => void;
  update: (patch: any) => void;
}

const useUserStore = create<UserState>()((set, get) => ({
  wallet: undefined,
  smartWalletAddress: undefined,
  loaded: undefined,

  setLoaded: (loaded: number | undefined) => {
    set({ loaded });
  },

  update: (patch) => {
    set({
      ...get(),
      ...patch,
    });
  },

  login: async (wallet: Wallet) => {
    const scwAddress = await getSmartWalletAddress(wallet.address);

    set({
      wallet,
      smartWalletAddress: scwAddress,
    });

    get().fetchBalances(scwAddress);
    get().fetchPrices();
    useVaultsStore.getState().fetchVaults(scwAddress);
  },

  fetchBalances: async (scwAddress?: string | null) => {
    const address = scwAddress ?? useUserStore.getState().smartWalletAddress;
    if (!address) return;

    try {
      const { data } = (await axios.get(
        `${getURLInApp()}/api/v1/user?scw=${address}`
      )) as { data: Balance[] };
      console.log(`fetched ${data.length} balances`);

      useTokensStore.getState().addBalances(data);
    } catch (error) {
      console.log("error fetching balances:", error);
    }
  },

  fetchPrices: async () => {
    try {
      const { data } = (await axios.get(`${getURLInApp()}/api/v1/prices`)) as {
        data: Price[];
      };
      console.log(`fetched ${data.length} prices`);

      useTokensStore.getState().addPrices(data);
    } catch (error) {
      console.log("error fetching prices:", error);
    }
  },
}));

export default useUserStore;
