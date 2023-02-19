import { create } from "zustand";
import "@ethersproject/shims";
import { Wallet } from "ethers";
import { getSmartWalletAddress } from "../utils/utils";
import axios from "axios";
import { getURLInApp } from "../utils/utils";
import { Balance, Price } from "../types/types";
import useTokensStore from "./tokens";
import useVaultsStore from "./vaults";
import { State } from "@web3auth/react-native-sdk";

interface UserState {
  wallet: Wallet | undefined;
  smartWalletAddress: string | undefined;
  userInfo: State["userInfo"] | undefined;
  login: (wallet: Wallet) => Promise<void>;
  fetchBalances: (
    scwAddress?: string | null,
    getPrices?: boolean
  ) => Promise<void>;
  fetchPrices: () => Promise<void>;
  loaded: number | undefined;
  setLoaded: (loaded: number | undefined) => void;
  setUserInfo: (userInfo: State["userInfo"]) => void;
}

const useUserStore = create<UserState>()((set, get) => ({
  wallet: undefined,
  smartWalletAddress: undefined,
  loaded: undefined,
  userInfo: undefined,

  setLoaded: (loaded: number | undefined) => {
    set({ loaded });
  },

  setUserInfo: (userInfo: State["userInfo"]) => {
    set({ userInfo });
  },

  login: async (newWallet: Wallet) => {
    const scwAddress = await getSmartWalletAddress(newWallet.address);

    set({
      wallet: newWallet,
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
        `${getURLInApp()}/api/v0.0.4/user?scw=${address}`
      )) as { data: Balance[] };
      console.log(`fetched ${data.length} balances`);

      useTokensStore.getState().addBalances(data);
    } catch (error) {
      console.log("error fetching balances:", error);
    }
  },

  fetchPrices: async () => {
    try {
      const { data } = (await axios.get(
        `${getURLInApp()}/api/v0.0.4/prices`
      )) as {
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
