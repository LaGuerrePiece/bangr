import { RouteProp, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import useTasksStore from "../state/tasks";
import useUserStore from "../state/user";
import { cutDecimals } from "../utils/format";
import useTokensStore from "../state/tokens";
import useVaultsStore from "../state/vaults";
import axios from "axios";
import { etherscanLink, getURLInApp } from "../utils/utils";
import { Task } from "../state/tasks";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import useActionsStore from "../state/actions";

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

  const { tasks, pendingTasks, fetchTasks } = useTasksStore((state) => ({
    tasks: state.tasks,
    pendingTasks: state.pendingTasks,
    fetchTasks: state.fetchTasks,
  }));

  const { actions, pendingActions, fetchActions } = useActionsStore(
    (state) => ({
      actions: state.actions,
      pendingActions: state.pendingActions,
      fetchActions: state.fetchActions,
    })
  );

  // const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [isTrackingTasks, setIsTrackingTasks] = useState(false);

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
    // fetchTasks();
    fetchActions();
    console.log("route.params?.waitingForTask", route.params?.waitingForTask);
  }, [smartWalletAddress]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // await fetchTasks();
    await fetchActions();
    setRefreshing(false);
  }, []);

  if (!vaults) return null;

  let interval: any = null;
  if (route.params?.waitingForTask && !isTrackingTasks) {
    setIsTrackingTasks(true);
    interval = setInterval(async () => {
      // fetchTasks();
      fetchActions();
      if (pendingTasks && pendingTasks.length === 0) {
        clearInterval(interval);
        setIsTrackingTasks(false);
        return;
      }
    }, 2000);
  }

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
        {actions.length - 1 !== 0 &&
        vaults &&
        actions.filter(
          (action) =>
            action.tasks[action.tasks.length - 1].state != 2 &&
            action.tasks[action.tasks.length - 1].state != -20
        ).length > 0 ? (
          <Text className="text-lg font-bold text-typo2-light dark:text-typo2-dark">
            Pending
          </Text>
        ) : null}

        {/* tasks that dont have state = 2 */}

        {actions.length !== 0 ? (
          actions
            .filter(
              (action) =>
                action.tasks[action.tasks.length - 1].state !== 2 &&
                action.tasks[action.tasks.length - 1].state != -20
            )
            .sort(function (a, b) {
              return b.id - a.id;
            })
            .map((action, index) => (
              <View
                className="my-1 flex flex-row items-center justify-between rounded-lg bg-secondary-light p-1 dark:bg-secondary-dark"
                key={index}
              >
                <View className="flex-row items-center py-2 px-2">
                  <Image
                    className="h-8 w-8"
                    source={
                      action.tasks[action.tasks.length - 1].type === "Swap"
                        ? colorScheme == "light"
                          ? require("../../assets/swap.png")
                          : require("../../assets/swap-drk.png")
                        : action.tasks[action.tasks.length - 1].type ===
                          "Invest"
                        ? colorScheme == "light"
                          ? require("../../assets/invest.png")
                          : require("../../assets/invest-drk.png")
                        : action.tasks[action.tasks.length - 1].type === "Send"
                        ? colorScheme == "light"
                          ? require("../../assets/send.png")
                          : require("../../assets/send-drk.png")
                        : colorScheme == "light"
                        ? require("../../assets/receive.png")
                        : require("../../assets/receive-drk.png")
                    }
                  />
                </View>
                <View className="flex-row">
                  <Text className="font-bold text-typo2-light dark:text-typo2-dark">
                    {cutDecimals(
                      action.tasks[action.tasks.length - 1].amount,
                      2
                    )}{" "}
                    {}
                  </Text>
                  <Image
                    className="h-5 w-5"
                    source={
                      getToken(action.tasks[action.tasks.length - 1].asset1)
                        ?.logoURI
                        ? {
                            uri: getToken(
                              action.tasks[action.tasks.length - 1].asset1
                            )?.logoURI,
                          }
                        : require("../../assets/task-error.png")
                    }
                  />
                  <Text className="ml-2 font-bold text-typo2-light dark:text-typo2-dark">
                    {action.tasks[action.tasks.length - 1].type === "Swap"
                      ? "to"
                      : action.tasks[action.tasks.length - 1].type === "Invest"
                      ? "into"
                      : action.tasks[action.tasks.length - 1].type ===
                        "Withdraw"
                      ? "from"
                      : "to"}{" "}
                  </Text>
                  <Image
                    className="ml-1 h-5 w-5"
                    // if swap get asset2 logo else get vault logo from vaults where vault is protocol
                    source={
                      action.tasks[action.tasks.length - 1].type === "Swap"
                        ? getToken(action.tasks[action.tasks.length - 1].asset2)
                            ?.logoURI
                          ? {
                              uri: getToken(
                                action.tasks[action.tasks.length - 1].asset2
                              )?.logoURI,
                            }
                          : require("../../assets/task-error.png")
                        : vaults!.find(
                            (vault) =>
                              vault.name ===
                              action.tasks[action.tasks.length - 1].protocol
                          )?.image
                        ? {
                            uri: vaults!.find(
                              (vault) =>
                                vault.name ===
                                action.tasks[action.tasks.length - 1].protocol
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
                      action.tasks[action.tasks.length - 1].state === 1 ||
                      action.tasks[action.tasks.length - 1].state === 0
                        ? colorScheme == "light"
                          ? require("../../assets/task-1.png")
                          : require("../../assets/task-1-drk.png")
                        : action.tasks[action.tasks.length - 1].state === 2
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
        {actions.length !== 0 ? (
          actions
            .filter(
              (action) =>
                action.tasks[action.tasks.length - 1].state === 2 ||
                action.tasks[action.tasks.length - 1].state == -20
            )
            .sort(function (a, b) {
              return b.id - a.id;
            })
            .map((action, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (
                    action.tasks[action.tasks.length - 1].txHash != null &&
                    action.tasks[action.tasks.length - 1].txHash != undefined &&
                    action.tasks[action.tasks.length - 1].txHash != ""
                  )
                    Linking.openURL(
                      etherscanLink(
                        action.tasks[action.tasks.length - 1].chainId,
                        action.tasks[action.tasks.length - 1].txHash
                      )
                    );
                }}
              >
                <View
                  className="my-1 flex flex-row items-center justify-between rounded-lg bg-secondary-light p-1 dark:bg-secondary-dark"
                  key={index}
                >
                  <View className="flex-row items-center py-2 px-2">
                    <Image
                      className="h-8 w-8"
                      source={
                        action.tasks[action.tasks.length - 1].type === "Swap"
                          ? colorScheme == "light"
                            ? require("../../assets/swap.png")
                            : require("../../assets/swap-drk.png")
                          : action.tasks[action.tasks.length - 1].type ===
                            "Invest"
                          ? colorScheme == "light"
                            ? require("../../assets/invest.png")
                            : require("../../assets/invest-drk.png")
                          : action.tasks[action.tasks.length - 1].type ===
                            "send"
                          ? colorScheme == "light"
                            ? require("../../assets/send.png")
                            : require("../../assets/send-drk.png")
                          : colorScheme == "light"
                          ? require("../../assets/receive.png")
                          : require("../../assets/receive-drk.png")
                      }
                    />
                  </View>
                  <View className="flex-row">
                    <Text className="font-bold text-typo2-light dark:text-typo2-dark">
                      {cutDecimals(
                        action.tasks[action.tasks.length - 1].amount,
                        2
                      )}{" "}
                      {}
                    </Text>
                    <Image
                      className="h-5 w-5"
                      source={
                        getToken(action.tasks[action.tasks.length - 1].asset1)
                          ?.logoURI
                          ? {
                              uri: getToken(
                                action.tasks[action.tasks.length - 1].asset1
                              )?.logoURI,
                            }
                          : require("../../assets/task-error.png")
                      }
                    />
                    <Text className="ml-2 font-bold text-typo2-light dark:text-typo2-dark">
                      {action.tasks[action.tasks.length - 1].type === "Swap"
                        ? "to"
                        : action.tasks[action.tasks.length - 1].type ===
                          "Invest"
                        ? "into"
                        : action.tasks[action.tasks.length - 1].type ===
                          "Withdraw"
                        ? "from"
                        : "to"}{" "}
                    </Text>
                    {action.tasks[action.tasks.length - 1].type === "send" ? (
                      <Text className="ml-1 font-bold text-typo2-light dark:text-typo2-dark">
                        {action.tasks[action.tasks.length - 1].asset2.substring(
                          0,
                          6
                        ) +
                          "..." +
                          action.tasks[action.tasks.length - 1].asset2.slice(
                            -4
                          )}
                      </Text>
                    ) : (
                      <Image
                        className="ml-1 h-5 w-5"
                        // if swap get asset2 logo else get vault logo from vaults where vault is protocol
                        source={
                          action.tasks[action.tasks.length - 1].type === "Swap"
                            ? getToken(
                                action.tasks[action.tasks.length - 1].asset2
                              )?.logoURI
                              ? {
                                  uri: getToken(
                                    action.tasks[action.tasks.length - 1].asset2
                                  )?.logoURI,
                                }
                              : require("../../assets/task-error.png")
                            : vaults!.find(
                                (vault) =>
                                  vault.name ===
                                  action.tasks[action.tasks.length - 1].protocol
                              )?.image
                            ? {
                                uri: vaults!.find(
                                  (vault) =>
                                    vault.name ===
                                    action.tasks[action.tasks.length - 1]
                                      .protocol
                                )?.image,
                              }
                            : require("../../assets/task-error.png")
                        }
                      />
                    )}
                  </View>
                  <View>
                    <Image
                      className="mr-1 h-8 w-8"
                      source={
                        // task is 1 or 0
                        action.tasks[action.tasks.length - 1].state === 1 ||
                        action.tasks[action.tasks.length - 1].state === 0
                          ? colorScheme == "light"
                            ? require("../../assets/task-1.png")
                            : require("../../assets/task-1-drk.png")
                          : action.tasks[action.tasks.length - 1].state === 2
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
              </TouchableOpacity>
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
