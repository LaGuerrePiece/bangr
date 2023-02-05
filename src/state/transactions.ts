import axios from "axios";
import { create } from "zustand";
import { getURLInApp } from "../utils/utils";

type Transaction = {
  type: string;
  protocol: string;
  status: "success" | "pending" | "failure";
};

interface TransactionsState {
  transactions: Transaction[];
  addTransactions: (...txs: Transaction[]) => void;
}

const useTransactionsStore = create<TransactionsState>()((set, get) => ({
  transactions: [],
  addTransactions: (...txs) => {
    set({ transactions: [...get().transactions, ...txs] });
  },
}));

export default useTransactionsStore;
