import { create } from "zustand";
import { Ramp } from "../types/types";
import axios from "axios";
import { devtools } from "zustand/middleware";
import { getURLInApp } from "../utils/utils";

interface RampsState {
  ramps: Ramp[] | undefined;
  fetchRamps: (scw?: string) => void;
}

const useRampsStore = create<RampsState>()(
  devtools((set, get) => ({
    ramps: undefined,

    fetchRamps: async (scw?: string) => {
      try {
        const { data } = (await axios.get(`${getURLInApp()}/api/v1/ramps`)) as {
          data: Ramp[];
        };

        console.log(`fetched ${data.length} ramps`);
        set({ ramps: data });
      } catch (error) {
        console.log("error fetching ramps", error);
      }
    },
  }))
);

export default useRampsStore;
