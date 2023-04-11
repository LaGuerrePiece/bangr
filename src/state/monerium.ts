import { create } from "zustand";
import "@ethersproject/shims";
import { MultichainToken } from "../types/types";
import { MoneriumUserData } from "../screens/onramp/Monerium/Webview";

interface UserState {
  iban: string | undefined;
  convertAutomatically: boolean;
  destinationToken: MultichainToken | undefined;
  profile: string | undefined;
  userData: MoneriumUserData | undefined;
  update: (patch: any) => void;
}

const useMoneriumStore = create<UserState>()((set, get) => ({
  iban: undefined,
  convertAutomatically: false,
  destinationToken: undefined,
  profile: undefined,
  userData: undefined,

  update: (patch) => {
    set({
      ...get(),
      ...patch,
    });
  },
}));

export default useMoneriumStore;
