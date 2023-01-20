import axios from "axios";
import { create } from "zustand";
import { getURLInApp } from "../utils/utils";

interface HistoricState {
  historic: any;
  fetchHistoric: (address: string) => void;
}

const useHistoricStore = create<HistoricState>()((set) => ({
  historic: [],
  fetchHistoric: async (address: string) => {
    console.log("getURLInApp()", getURLInApp());
    const { data } = await axios.get(
      `${getURLInApp()}/api/historic?wallet=${address}`
    );
    set({ historic: data });
  },
}));

export default useHistoricStore;
