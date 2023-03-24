import axios from "axios";
import { create } from "zustand";
import { address } from "../utils/address";
import { getURLInApp } from "../utils/utils";

export type Task = {
  type: string;
  protocol: string;
  chainId: number;
  txHash: string;
  state: number;
};

interface TasksState {
  tasks: Task[];
  addTasks: (...tasks: Task[]) => void; 
  // fuction to fetch tasks for a scwAddress
  fetchTasks: (scwAddress: string) => void;
}

const useTasksStore = create<TasksState>()((set, get) => ({
  tasks: [],
  addTasks: (...tasks) => {
    set({ tasks: [...get().tasks, ...tasks] });
  },
  fetchTasks: async (scwAddress: string) => {
    try {
      // axios get request to fetch tasks for a scwAddress
      // with a get parameter scwAddress
      const { data } = (await axios.get(
        `${getURLInApp()}/api/v1/tasks?scwAddress=${scwAddress}`
      )) as {
        data: Task[];
      };
      console.log(`fetched ${data.length} tasks`);
      set({ tasks: data });
    } catch (error) {
      console.log("error fetching tasks:", error);
    }
  }
}));

export default useTasksStore;
