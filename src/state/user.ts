import "@ethersproject/shims";

import { create } from "zustand";
import { Wallet } from "ethers";
import { getSmartWalletAddress } from "../utils/utils";
import useHistoricStore from "./historic";
import axios from "axios";
import { getURLInApp } from "../utils/utils";
import { Balances } from "../types/types";
import useTokensStore from "./tokens";

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
    useHistoricStore.getState().fetchHistoric(scwAddress);
  },

  fetchBalances: async (scwAddress?: string | null) => {
    const address = scwAddress ?? useUserStore.getState().smartWalletAddress;
    if (!address) return;

    const { data } = (await axios.get(
      `${getURLInApp()}/api/user?scw=${address}`
    )) as { data: Balances[] };
    console.log(`fetched ${data.length} balances`);

    useTokensStore.getState().addBalances(data);
  },
}));

export default useUserStore;
