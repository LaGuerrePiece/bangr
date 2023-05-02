import axios from "axios";
import { create } from "zustand";
import { address } from "../utils/address";
import { getSmartWalletAddress, getURLInApp } from "../utils/utils";
import useUserStore from "./user";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import useVaultsStore from "./vaults";

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
  pendingTasks: Task[];
  previousPendingTasks: Task[];
  addTasks: (...tasks: Task[]) => void;
  // fuction to fetch tasks for a scwAddress
  fetchTasks: () => Promise<void>;
}

const useTasksStore = create<TasksState>()((set, get) => ({
  smartWalletAddress: undefined,
  wallet: undefined,
  tasks: [],
  pendingTasks: [],
  previousPendingTasks: [],
  addTasks: (...tasks) => {
    set({ tasks: [...get().tasks, ...tasks] });
  },
  fetchTasks: async () => {
    try {
      const wallet = useUserStore.getState().wallet;
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
      // console.log(`fetched ${data.length} tasks`);
      // console.log(data);
      const pendingTasks = data.filter(
        (task) => task.state !== 2 && task.state !== -20
      );
      // console.log(`fetched ${pendingTasks.length} pending tasks`);
      // if task in pending task and in previous pending task
      // and has state 2 in pending tasks but not in previous pending tasks
      // then send Toast
      const previousPendingTasks = get().previousPendingTasks;

      if (pendingTasks.length < previousPendingTasks.length) {
        // console.log("send Toast");
        // get the task that is not in pending tasks
        const task = previousPendingTasks.filter(
          (task) => !pendingTasks.includes(task)
        )[0];
        if (task.state > 0) {
          Toast.show({
            type: "success",
            text1: "Transaction confirmed",
            text2: "Your transaction has been confirmed",
            visibilityTime: 2500,
            autoHide: true,
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Transaction failed",
            text2: "Your transaction has failed",
            visibilityTime: 2500,
            autoHide: true,
          });
          useUserStore.getState().fetchBalances();
          useVaultsStore.getState().fetchVaults();
        }
      }
      set({
        tasks: data,
        pendingTasks: pendingTasks,
        previousPendingTasks: pendingTasks,
      });
    } catch (error) {
      console.log("error fetching tasks:", error);
    }
  },
}));

export default useTasksStore;
