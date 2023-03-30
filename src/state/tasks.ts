import axios from "axios";
import { create } from "zustand";
import { address } from "../utils/address";
import { getSmartWalletAddress, getURLInApp } from "../utils/utils";
import useUserStore from "./user";

export type Task = {
  type: string;
  protocol: string;
  chainId: number;
  txHash: string;
  state: number;
  asset1: string;
  asset2: string;
  amount: string;
};

interface TasksState {
  tasks: Task[];
  addTasks: (...tasks: Task[]) => void; 
  // fuction to fetch tasks for a scwAddress
  fetchTasks: () => void;
}

const useTasksStore = create<TasksState>()((set, get) => ({
  smartWalletAddress: undefined,
  wallet: undefined,
  tasks: [],
  addTasks: (...tasks) => {
    set({ tasks: [...get().tasks, ...tasks] });
  },
  fetchTasks: async () => {
    try {
      const wallet = useUserStore.getState().wallet;
      console.log("wallet", wallet);
      if (!wallet) return;
      const scwAddress = await getSmartWalletAddress(wallet.address);
      console.log("Get tasks for ", scwAddress);
      // axios get request to fetch tasks for a scwAddress
      // with a get parameter scwAddress
      const { data } = (await axios.get(
        `${getURLInApp()}/api/v1/tasks?scwAddress=${scwAddress}`
      )) as {
        data: Task[];
      };
      console.log(`fetched ${data.length} tasks`);
      console.log(data);
      set({ tasks: data });
    } catch (error) {
      console.log("error fetching tasks:", error);
    }
  }
}));

export default useTasksStore;
