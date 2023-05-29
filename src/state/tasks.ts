import axios from "axios";
import { create } from "zustand";
import { address } from "../utils/address";
import { getSmartWalletAddress, getURLInApp } from "../utils/utils";
import useUserStore from "./user";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import useVaultsStore from "./vaults";
import { useTranslation } from "react-i18next";
import { track } from "../utils/analytics";

export type Task = {
  id: string;
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
      const { t } = useTranslation();
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
        console.log("task", task.state);
        if (task.state >= 1) {
          Toast.show({
            type: "success",
            text1: t("transactionConfirmed"),
            text2: t("yourTransactionHasBeenConfirmed"),
            visibilityTime: 2500,
            autoHide: true,
          });
        } else if (task.state < 0) {
          Toast.show({
            type: "error",
            text1: t("transactionFailed"),
            text2: t("yourTransactionHasFailed"),
            visibilityTime: 2500,
            autoHide: true,
          });
          track("Transaction failed", scwAddress);
        }
        if (pendingTasks.length === 0 && previousPendingTasks.length > 0) {
          console.log("set repeat to false");
          set({ repeat: false });
          useUserStore.getState().fetchBalances(scwAddress);
          useVaultsStore.getState().fetchVaults(scwAddress);
        }
        console.log("pendingTasks.lenght", pendingTasks.length);
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
    // console.log("repeat fetch tasks");
    set({ repeat: true });
    let interval = setInterval(async () => {
      // if (get().pendingTasks.length === 0) {
      //   set({ repeat: false });
      // }
      console.log("repeat fetch tasks", get().repeat);
      if (get().repeat) {
        await get().fetchTasks();
      } else {
        clearInterval(interval);
      }
    }, 2000);
  },
}));

export default useTasksStore;
