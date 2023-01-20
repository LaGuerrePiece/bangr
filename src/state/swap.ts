import { create } from "zustand";
import { CallWithNonce, MultichainToken, Quote } from "../types/types";
import { devtools } from "zustand/middleware";

interface SwapState {
  amountIn: string | null;
  debouncedAmountIn: string | null;
  srcToken: MultichainToken | null;
  dstToken: MultichainToken | null;
  quote: Quote | null;
  calls: CallWithNonce[] | null;
  isSearching: boolean;
  update: (patch: any) => void;
  clearAfterSwap: () => void;
  set: (patch: any) => void;
  updateSrcToken: (srcToken: MultichainToken) => void;
  updateDstToken: (dstToken: MultichainToken) => void;
}

const useSwapStore = create<SwapState>()(
  devtools((set, get) => ({
    amountIn: null,
    debouncedAmountIn: null,
    srcToken: null,
    dstToken: null,
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

    updateSrcToken: (srcToken: MultichainToken) => {
      if (srcToken.symbol === get().dstToken?.symbol) {
        set({
          ...get(),
          srcToken,
          dstToken: get().srcToken,
        });
      } else {
        set({
          ...get(),
          srcToken,
        });
      }
    },

    updateDstToken: (dstToken: MultichainToken) => {
      if (dstToken.symbol === get().srcToken?.symbol) {
        set({
          ...get(),
          dstToken,
          srcToken: get().dstToken,
        });
      } else {
        set({
          ...get(),
          dstToken,
        });
      }
    },

    clearAfterSwap: () => {
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

export default useSwapStore;
