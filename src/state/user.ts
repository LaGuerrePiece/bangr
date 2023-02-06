import { create } from "zustand";
import "@ethersproject/shims";
import { Wallet } from "ethers";
import { getSmartWalletAddress } from "../utils/utils";
import axios from "axios";
import { getURLInApp } from "../utils/utils";
import { Balances } from "../types/types";
import useTokensStore from "./tokens";
import useVaultsStore from "./vaults";

interface UserState {
  wallet: Wallet | undefined;
  smartWalletAddress: string | undefined;
  login: (wallet: Wallet) => void;
  fetchBalances: (scwAddress?: string | null) => void;
}

const useUserStore = create<UserState>()((set, get) => ({
  wallet: undefined,
  smartWalletAddress: undefined,

  login: async (newWallet: Wallet) => {
    const scwAddress = await getSmartWalletAddress(newWallet.address);

    set({
      wallet: newWallet,
      smartWalletAddress: scwAddress,
    });

    get().fetchBalances(scwAddress);
    useVaultsStore.getState().fetchVaults(scwAddress);
  },

  fetchBalances: async (scwAddress?: string | null) => {
    const address = scwAddress ?? useUserStore.getState().smartWalletAddress;
    if (!address) return;

    try {
      const { data } = (await axios.get(
        `${getURLInApp()}/api/user?scw=${address}`
      )) as { data: Balances[] };
      console.log(`fetched ${data.length} balances`);

      useTokensStore.getState().addBalances(data);
    } catch (error) {
      console.log("error fetching balances:", error);
    }
  },
}));

export default useUserStore;
