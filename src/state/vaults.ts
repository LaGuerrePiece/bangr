import { create } from "zustand";
import { VaultData } from "../types/types";
import axios from "axios";
import { devtools } from "zustand/middleware";
import { getURLInApp } from "../utils/utils";

interface VaultState {
  vaults: VaultData[] | undefined;
  fetchVaults: (scw?: string) => void;
}

const useVaultsStore = create<VaultState>()(
  devtools((set, get) => ({
    vaults: undefined,

    fetchVaults: async (scw?: string) => {
      const { data } = (await axios.get(
        `${getURLInApp()}/api/vaults?address=${scw}`
      )) as {
        data: VaultData[];
      };
      console.log("getVaults. response:", data);
      set({ vaults: data });
    },
  }))
);

export default useVaultsStore;
