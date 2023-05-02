import { create } from "zustand";
import { CallWithNonce, ChainId, MultichainToken, Quote } from "../types/types";
import { devtools } from "zustand/middleware";

interface SendState {
  amountIn: string | null;
  debouncedAmountIn: string | null;
  tokenSymbol: string;
  chainId: ChainId;
  toAddress: string | null;
  quote: Quote | null;
  calls: CallWithNonce[] | null;
  isSearching: boolean;
  update: (patch: any) => void;
  clearAfterSend: () => void;
  set: (patch: any) => void;
  updateSendToken: (tokenSymbol: string) => void;
}

const useSendStore = create<SendState>()(
  devtools((set, get) => ({
    amountIn: null,
    debouncedAmountIn: null,
    tokenSymbol: "USDC",
    chainId: 137,
    toAddress: null,
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

    updateSendToken: (tokenSymbol: string) => {
      set({
        ...get(),
        tokenSymbol,
      });
    },

    clearAfterSend: () => {
      set({
        ...get(),
        amountIn: null,
        debouncedAmountIn: null,
        quote: null,
        calls: null,
        toAddress: null,
        isSearching: false,
      });
    },
  }))
);

export default useSendStore;
