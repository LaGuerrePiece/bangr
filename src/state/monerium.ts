import { create } from "zustand";
import "@ethersproject/shims";
import { MultichainToken } from "../types/types";

interface UserState {
  name: string | undefined;
  iban: string | undefined;
  convertAutomatically: boolean;
  destinationToken: MultichainToken | undefined;
  update: (patch: any) => void;
}

const useMoneriumStore = create<UserState>()((set, get) => ({
  name: undefined,
  iban: undefined,
  convertAutomatically: false,
  destinationToken: undefined,

  update: (patch) => {
    set({
      ...get(),
      ...patch,
    });
  },
}));

export default useMoneriumStore;
