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
      try {
        const { data } = (await axios.get(
          `${getURLInApp()}/api/v1/vaults?address=${scw}`
        )) as {
          data: VaultData[];
        };

        console.log(`fetched ${data.length} vaults`);
        set({ vaults: data });
      } catch (error) {
        console.log("error fetching vaults", error);
      }
    },
  }))
);

export default useVaultsStore;
