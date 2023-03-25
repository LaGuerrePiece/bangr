import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface BangrampState {
  amountIn: string | null;
  email?: string;
  cardNumber?: string;
  cardHolderName?: string;
  expirationDate?: string;
  cvv?: string;
  country?: string;
  zip?: string;
  update: (patch: any) => void;
}

const useBangrampStore = create<BangrampState>()(
  devtools((set, get) => ({
    amountIn: null,
    email: undefined,
    cardNumber: undefined,
    cardHolderName: undefined,
    expirationDate: undefined,
    cvv: undefined,
    country: undefined,
    zip: undefined,

    update: (patch) => {
      set({
        ...get(),
        ...patch,
      });
    },
  }))
);

export default useBangrampStore;
