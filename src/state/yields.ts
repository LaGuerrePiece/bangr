import { create } from "zustand";
import { YieldAsset } from "../types/types";
import axios from "axios";
import { devtools } from "zustand/middleware";
import { getURLInApp } from "../utils/utils";

interface YieldsState {
  yields: YieldAsset[] | undefined;
  fetchYields: (scw?: string) => void;
}

const useYieldsStore = create<YieldsState>()(
  devtools((set, get) => ({
    yields: undefined,

    fetchYields: async (scw?: string) => {
      try {
        const { data } = (await axios.get(
          `${getURLInApp()}/api/v1/yields?address=${scw}`
        )) as {
          data: YieldAsset[];
        };

        console.log(`fetched ${data.length} yields`);
        set({ yields: data });
      } catch (error) {
        console.log("error fetching yields", error);
      }
    },
  }))
);

export default useYieldsStore;
