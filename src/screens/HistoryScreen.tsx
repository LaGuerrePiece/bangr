import { RouteProp, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import useTasksStore from "../state/tasks";
import useUserStore from "../state/user";
import * as Haptics from "expo-haptics";
import { cutDecimals } from "../utils/format";
import useTokensStore from "../state/tokens";
import useVaultsStore from "../state/vaults";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import axios from "axios";
import { getURLInApp } from "../utils/utils";
import { Task } from "../state/tasks";

type HistoryParams = {
  HistoryScreen: {
    waitingForTask: boolean;
  };
};

const HistoryScreen = ({
  route,
  navigation,
}: {
  route: RouteProp<HistoryParams, "HistoryScreen">;
  navigation: any;
}) => {
  const colorScheme = useColorScheme();
  const { tasks, fetchTasks } = useTasksStore((state) => ({
    tasks: state.tasks,
    fetchTasks: state.fetchTasks,
  }));
  const { smartWalletAddress, fetchBalances } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
    fetchBalances: state.fetchBalances,
  }));

  const { vaults, fetchVaults } = useVaultsStore((state) => ({
    vaults: state.vaults,
    fetchVaults: state.fetchVaults,
  }));

  const { getToken } = useTokensStore((state) => ({
    getToken: state.getToken,
  }));

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!smartWalletAddress) return;
    fetchTasks();
  }, [smartWalletAddress]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, []);

  const getTasks = async (scwAddress: string) => {
    try {
      const { data } = (await axios.post(
        `${getURLInApp()}/api/v1/tasks`,
        scwAddress,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )) as { data: Task[] };
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error relaying transaction: ", error.message);
      } else {
        console.log("unexpected error relaying transaction: ", error);
      }
    }
  };

  const pTasks = tasks.filter((task) => task.state !== 2 && task.state > -2);
  console.log(route.params?.waitingForTask);

  const waitForTask = async () => {
    Toast.show({
      type: "info",
      text1: "Transaction sent",
      text2: "Waiting for confirmation...",
    });
    console.log("waiting for task");

    const tasks = await getTasks(smartWalletAddress!);
    fetchTasks();
    // foreach task in pending tasks
    pTasks.forEach(async (task) => {
      do {
        console.log("task", task?.state);
        // if task is in pending tasks
        if (tasks!.find((t) => t.txHash === task.txHash && t.state > -2)) {
          console.log("task found");
          // if task is confirmed
          if (task.state === 2) {
            console.log("task confirmed");
            Toast.show({
              type: "success",
              text1: "Transaction confirmed",
              text2: "Your balances have been updated",
            });
            // fetch balances
            fetchBalances();
            fetchVaults();
            fetchTasks();
            Toast.show({
              type: "success",
              text1: "Transaction confirmed",
              text2: "Your balances have been updated",
            });
            return;
          }
        }

        // wait 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } while (task.state !== 2);
    });
  };

  // console log pending tasks

  if (pTasks && pTasks.length > 0 && route.params?.waitingForTask) {
    console.log("pending tasks");
    waitForTask();
  }

  if (!vaults) return null;

  return (
    <SafeAreaView className="h-full items-center bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto mt-4 w-11/12 items-center rounded-xl">
        <View className="w-full flex-row justify-end">
          <TouchableOpacity
            onPress={() => {
              // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Image
              className="h-7 w-7"
              source={
                colorScheme === "dark"
                  ? require("../../assets/swap-drk.png")
                  : require("../../assets/swap.png")
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        className="mx-auto mt-5 w-11/12 rounded-lg"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tasks.length !== 0 &&
        vaults &&
        tasks.filter((task) => task.state != 2 && task.state != -20).length >
          0 ? (
          <Text className="text-lg font-bold text-typo2-light dark:text-typo2-dark">
            Pending
          </Text>
        ) : null}

        {/* tasks that dont have state = 2 */}

        {tasks.length !== 0 ? (
          tasks
            .filter((task) => task.state !== 2 && task.state != -20)
            .reverse()
            .map((task, index) => (
              <View
                className="my-1 flex flex-row items-center justify-between rounded-lg bg-secondary-light p-1 dark:bg-secondary-dark"
                key={index}
              >
                <View className="flex-row items-center py-2 px-2">
                  <Image
                    className="h-8 w-8"
                    source={
                      task.type === "Swap"
                        ? colorScheme == "light"
                          ? require("../../assets/swap.png")
                          : require("../../assets/swap-drk.png")
                        : task.type === "Invest"
                        ? colorScheme == "light"
                          ? require("../../assets/invest.png")
                          : require("../../assets/invest-drk.png")
                        : colorScheme == "light"
                        ? require("../../assets/receive.png")
                        : require("../../assets/receive-drk.png")
                    }
                  />
                </View>
                <View className="flex-row">
                  <Text className="font-bold text-typo2-light dark:text-typo2-dark">
                    {cutDecimals(task.amount, 2)} {}
                  </Text>
                  <Image
                    className="h-5 w-5"
                    source={
                      getToken(task.asset1)?.logoURI
                        ? { uri: getToken(task.asset1)?.logoURI }
                        : require("../../assets/task-error.png")
                    }
                  />
                  <Text className="ml-2 font-bold text-typo2-light dark:text-typo2-dark">
                    {task.type === "Swap"
                      ? "to"
                      : task.type === "Invest"
                      ? "into"
                      : task.type === "Withdraw"
                      ? "from"
                      : "to"}{" "}
                  </Text>
                  <Image
                    className="ml-1 h-5 w-5"
                    // if swap get asset2 logo else get vault logo from vaults where vault is protocol
                    source={
                      task.type === "Swap"
                        ? getToken(task.asset2)?.logoURI
                          ? { uri: getToken(task.asset2)?.logoURI }
                          : require("../../assets/task-error.png")
                        : vaults!.find((vault) => vault.name === task.protocol)
                            ?.image
                        ? {
                            uri: vaults!.find(
                              (vault) => vault.name === task.protocol
                            )?.image,
                          }
                        : require("../../assets/task-error.png")
                    }
                  />
                </View>
                <View>
                  <Image
                    className="mr-1 h-8 w-8"
                    source={
                      // task is 1 or 0
                      task.state === 1 || task.state === 0
                        ? colorScheme == "light"
                          ? require("../../assets/task-1.png")
                          : require("../../assets/task-1-drk.png")
                        : task.state === 2
                        ? colorScheme == "light"
                          ? require("../../assets/task-2.png")
                          : require("../../assets/task-2-drk.png")
                        : colorScheme == "light"
                        ? require("../../assets/task-error.png")
                        : require("../../assets/task-error-drk.png")
                    }
                  />
                </View>
              </View>
            ))
        ) : (
          <Text className="text-s font-bold text-typo2-light dark:text-typo2-dark">
            No transaction yet
          </Text>
        )}

        {/* tasks that have state = 2 */}
        <Text className="text-lg font-bold text-typo2-light dark:text-typo2-dark">
          Completed
        </Text>
        {tasks.length !== 0 ? (
          tasks
            .filter((task) => task.state === 2 || task.state == -20)
            .reverse()
            .map((task, index) => (
              <View
                className="my-1 flex flex-row items-center justify-between rounded-lg bg-secondary-light p-1 dark:bg-secondary-dark"
                key={index}
              >
                <View className="flex-row items-center py-2 px-2">
                  <Image
                    className="h-8 w-8"
                    source={
                      task.type === "Swap"
                        ? colorScheme == "light"
                          ? require("../../assets/swap.png")
                          : require("../../assets/swap-drk.png")
                        : task.type === "Invest"
                        ? colorScheme == "light"
                          ? require("../../assets/invest.png")
                          : require("../../assets/invest-drk.png")
                        : colorScheme == "light"
                        ? require("../../assets/receive.png")
                        : require("../../assets/receive-drk.png")
                    }
                  />
                </View>
                <View className="flex-row">
                  <Text className="font-bold text-typo2-light dark:text-typo2-dark">
                    {cutDecimals(task.amount, 2)} {}
                  </Text>
                  <Image
                    className="h-5 w-5"
                    source={
                      getToken(task.asset1)?.logoURI
                        ? { uri: getToken(task.asset1)?.logoURI }
                        : require("../../assets/task-error.png")
                    }
                  />
                  <Text className="ml-2 font-bold text-typo2-light dark:text-typo2-dark">
                    {task.type === "Swap"
                      ? "to"
                      : task.type === "Invest"
                      ? "into"
                      : task.type === "Withdraw"
                      ? "from"
                      : "to"}{" "}
                  </Text>
                  <Image
                    className="ml-1 h-5 w-5"
                    // if swap get asset2 logo else get vault logo from vaults where vault is protocol
                    source={
                      task.type === "Swap"
                        ? getToken(task.asset2)?.logoURI
                          ? { uri: getToken(task.asset2)?.logoURI }
                          : require("../../assets/task-error.png")
                        : vaults!.find((vault) => vault.name === task.protocol)
                            ?.image
                        ? {
                            uri: vaults!.find(
                              (vault) => vault.name === task.protocol
                            )?.image,
                          }
                        : require("../../assets/task-error.png")
                    }
                  />
                </View>
                <View>
                  <Image
                    className="mr-1 h-8 w-8"
                    source={
                      // task is 1 or 0
                      task.state === 1 || task.state === 0
                        ? colorScheme == "light"
                          ? require("../../assets/task-1.png")
                          : require("../../assets/task-1-drk.png")
                        : task.state === 2
                        ? colorScheme == "light"
                          ? require("../../assets/task-2.png")
                          : require("../../assets/task-2-drk.png")
                        : colorScheme == "light"
                        ? require("../../assets/task-error.png")
                        : require("../../assets/task-error-drk.png")
                    }
                  />
                </View>
              </View>
            ))
        ) : (
          <Text className="text-s font-bold text-typo2-light dark:text-typo2-dark">
            No complete transaction yet
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
