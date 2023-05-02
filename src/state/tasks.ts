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
  repeat: boolean;
  addTasks: (...tasks: Task[]) => void;
  // fuction to fetch tasks for a scwAddress
  fetchTasks: () => Promise<void>;
  repeatFetchTasks: () => void;
}

const useTasksStore = create<TasksState>()((set, get) => ({
  smartWalletAddress: undefined,
  wallet: undefined,
  tasks: [],
  pendingTasks: [],
  previousPendingTasks: [],
  repeat: false,
  addTasks: (...tasks) => {
    set({ tasks: [...get().tasks, ...tasks] });
  },
  fetchTasks: async () => {
    try {
      const scwAddress = useUserStore.getState().smartWalletAddress;
      console.log("Get tasks for ", scwAddress);
      // axios get request to fetch tasks for a scwAddress
      // with a get parameter scwAddress
      const { data } = (await axios.get(
        `${getURLInApp()}/api/v1/tasks?scwAddress=${scwAddress}`
      )) as {
        data: Task[];
      };

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

        //if task that is in previous pending but not in pending is now state 2
        // then send Toast
        const task = previousPendingTasks.filter(
          (task) => !pendingTasks.includes(task)
        )[0];
        if (task.state === 2) {
          Toast.show({
            type: "success",
            text1: "Transaction confirmed",
            text2: "Your transaction has been confirmed",
            visibilityTime: 2500,
            autoHide: true,
          });
          useUserStore.getState().fetchBalances(scwAddress);
          useVaultsStore.getState().fetchVaults(scwAddress);
        } else if (task.state < 0) {
          Toast.show({
            type: "error",
            text1: "Transaction failed",
            text2: "Your transaction has failed",
            visibilityTime: 2500,
            autoHide: true,
          });
        }
        if (pendingTasks.length === 0) {
          set({ repeat: false });
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
  repeatFetchTasks: () => {
    console.log("repeat fetch tasks");
    set({ repeat: true });
    let interval = setInterval(async () => {
      if (get().repeat) {
        await get().fetchTasks();
      } else {
        clearInterval(interval);
      }
    }, 2000);
  },
}));

export default useTasksStore;
