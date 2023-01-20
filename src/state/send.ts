import { create } from "zustand";
import { CallWithNonce, ChainId, MultichainToken, Quote } from "../types/types";
import { devtools } from "zustand/middleware";

interface SendState {
  amountIn: string | null;
  debouncedAmountIn: string | null;
  srcToken: MultichainToken | null;
  chain: ChainId | null;
  quote: Quote | null;
  calls: CallWithNonce[] | null;
  isSearching: boolean;
  update: (patch: any) => void;
  clearAfterSend: () => void;
  set: (patch: any) => void;
}

const useSendStore = create<SendState>()(
  devtools((set, get) => ({
    amountIn: null,
    debouncedAmountIn: null,
    chain: null,
    srcToken: null,
    quote: null,
    calls: null,
    isSearching: false,

    update: (patch) => {
      set({
        ...get(),
        ...patch,
      });
    },

    set,

    clearAfterSend: () => {
      set({
        ...get(),
        amountIn: null,
        debouncedAmountIn: null,
        quote: null,
        calls: null,
        isSearching: false,
      });
    },
  }))
);

export default useSendStore;
