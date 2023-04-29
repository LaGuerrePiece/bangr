import axios from "axios";
import { create } from "zustand";
import { address } from "../utils/address";
import { getSmartWalletAddress, getURLInApp } from "../utils/utils";
import useUserStore from "./user";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import useVaultsStore from "./vaults";
import { Task } from "./tasks";

export type Action = {
  id: number;
  tasks: Task[];
};

interface ActionsState {
  actions: Action[];
  pendingActions: Action[];
  previousPendingActions: Action[];
  addActions: (...actions: Action[]) => void;
  // fuction to fetch actions for a scwAddress
  fetchActions: () => Promise<void>;
}

const useActionsStore = create<ActionsState>()((set, get) => ({
  smartWalletAddress: undefined,
  wallet: undefined,
  actions: [],
  pendingActions: [],
  previousPendingActions: [],
  addActions: (...actions) => {
    set({ actions: [...get().actions, ...actions] });
  },
  fetchActions: async () => {
    try {
      const wallet = useUserStore.getState().wallet;
      if (!wallet) return;
      const scwAddress = await getSmartWalletAddress(wallet.address);
      console.log("Get actions for ", scwAddress);
      // axios get request to fetch actions for a scwAddress
      // with a get parameter scwAddress
      const { data } = (await axios.get(
        `${getURLInApp()}/api/v1/actions?scwAddress=${scwAddress}`
      )) as {
        data: Action[];
      };
      // console.log(`fetched ${data.length} actions`);
      // console.log(data);
      console.log(data);
      console.log(data[0].tasks[data[0].tasks.length - 1 - 1].state);
      const pendingActions = data.filter(
        (action) =>
          action.tasks[action.tasks.length - 1].state !== 2 &&
          action.tasks[action.tasks.length - 1].state !== -200
      );
      // console.log(`fetched ${pendingActions.length} pending actions`);
      // if task in pending task and in previous pending task
      // and has state 2 in pending actions but not in previous pending actions
      // then send Toast
      const previousPendingActions = get().previousPendingActions;
      // pendingActions.forEach((task) => {
      //   if (
      //     previousPendingActions.find(
      //       (previousPendingAction) =>
      //         previousPendingAction.txHash === task.txHash &&
      //         previousPendingAction.state === 2
      //     ) === undefined &&
      //     task.state === 2
      //   ) {
      //     console.log("send Toast");
      //   }
      // });
      if (pendingActions.length < previousPendingActions.length) {
        // console.log("send Toast");
        Toast.show({
          type: "success",
          text1: "Transaction confirmed",
          text2: "Your transaction has been confirmed",
          visibilityTime: 2500,
          autoHide: true,
        });
        useUserStore.getState().fetchBalances();
        useVaultsStore.getState().fetchVaults();
      }
      set({
        actions: data,
        pendingActions: pendingActions,
        previousPendingActions: pendingActions,
      });
    } catch (error) {
      console.log("error fetching actions:", error);
    }
  },
}));

export default useActionsStore;
