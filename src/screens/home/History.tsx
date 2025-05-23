import { CompositeScreenProps } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import useTasksStore from "../../state/tasks";
import useUserStore from "../../state/user";
import { cutDecimals } from "../../utils/format";
import useTokensStore from "../../state/tokens";
import useVaultsStore from "../../state/vaults";
import axios from "axios";
import { etherscanLink, getURLInApp } from "../../utils/utils";
import { Task } from "../../state/tasks";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { MainScreenStackParamList } from "../MainScreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { fetchText } from "react-native-svg/lib/typescript/xml";
import { useTranslation } from "react-i18next";

const History = ({
  route,
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<MainScreenStackParamList, "History">,
  NativeStackScreenProps<RootStackParamList>
>) => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const { tasks, pendingTasks, repeat, fetchTasks, repeatFetchTasks } =
    useTasksStore((state) => ({
      tasks: state.tasks,
      pendingTasks: state.pendingTasks,
      repeat: state.repeat,
      // pendingTasks: state.pendingTasks,
      fetchTasks: state.fetchTasks,
      repeatFetchTasks: state.repeatFetchTasks,
    }));

  // const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  // const [isTrackingTasks, setIsTrackingTasks] = useState(false);

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
  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, []);

  if (!vaults) return null;

  // if (route.params?.waitingForTask && !repeat) {
  //   repeatFetchTasks();
  // }

  return (
    <SafeAreaView className="h-full items-center bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto mt-4 w-full items-center justify-center rounded-xl">
        {/* <View className="w-full flex-row justify-end">
          <TouchableOpacity
            onPress={() => {
              // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Image
              className="h-7 w-7"
              source={
                colorScheme === "dark"
                  ? require("../../../assets/swap-drk.png")
                  : require("../../../assets/swap.png")
              }
            />
          </TouchableOpacity>
        </View> */}
        {repeat ? (
          <View className="flex-row justify-center">
            <ActivityIndicator />
          </View>
        ) : null}
      </View>
      <View className="mx-auto mt-4 w-full items-center bg-primary-light dark:bg-primary-dark">
        <Text className="text-center font-InterBold text-3xl text-typo-light dark:text-typo-dark">
          {t("History")}
        </Text>
      </View>
      <ScrollView
        className="mx-auto w-full rounded-lg"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tasks.length !== 0 &&
        vaults &&
        tasks.filter((task) => task.state != 2 && task.state != -20).length >
          0 ? (
          <Text className="m-4 text-lg font-bold text-typo2-light dark:text-typo2-dark">
            {t("pending")}
          </Text>
        ) : null}

        {/* tasks that dont have state = 2 */}

        {tasks.length !== 0 ? (
          tasks
            .filter((task) => task.state !== 2 && task.state != -20)
            //sort by id alphabetically
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((task, index) => (
              <View
                className={
                  index % 2 == 0
                    ? "flex flex-row items-center justify-between bg-secondary-light p-3 dark:bg-secondary-dark "
                    : "flex flex-row items-center justify-between bg-primary-light p-3 dark:bg-primary-dark "
                }
                key={index}
              >
                <View className="flex-row items-center py-2 px-2">
                  <Image
                    className="h-8 w-8"
                    source={
                      task.type === "Swap"
                        ? colorScheme == "light"
                          ? require("../../../assets/swap.png")
                          : require("../../../assets/swap-drk.png")
                        : task.type === "Invest"
                        ? colorScheme == "light"
                          ? require("../../../assets/seed.png")
                          : require("../../../assets/seed-drk.png")
                        : task.type === "Send"
                        ? colorScheme == "light"
                          ? require("../../../assets/send.png")
                          : require("../../../assets/send-drk.png")
                        : colorScheme == "light"
                        ? require("../../../assets/receive.png")
                        : require("../../../assets/receive-drk.png")
                    }
                  />
                </View>
                <View className="flex-row">
                  <Text className="font-bold text-typo2-light dark:text-typo2-dark">
                    {cutDecimals(task.amount, 4)} {}
                  </Text>
                  <Image
                    className="h-5 w-5"
                    source={
                      getToken(task.asset1)?.logoURI
                        ? { uri: getToken(task.asset1)?.logoURI }
                        : require("../../../assets/task-error.png")
                    }
                  />
                  <Text className="ml-2 font-bold text-typo2-light dark:text-typo2-dark">
                    {task.type === "Swap"
                      ? t("to")
                      : task.type === "Invest"
                      ? t("into")
                      : task.type === "Withdraw"
                      ? t("from")
                      : t("to")}{" "}
                  </Text>
                  {task.type === "send" ? (
                    <Text className="ml-1 font-bold text-typo2-light dark:text-typo2-dark">
                      {task.asset2.substring(0, 6) +
                        "..." +
                        task.asset2.slice(-4)}
                    </Text>
                  ) : (
                    <Image
                      className="ml-1 h-5 w-5"
                      // if swap get asset2 logo else get vault logo from vaults where vault is protocol
                      source={
                        task.type === "Swap"
                          ? getToken(task.asset2)?.logoURI
                            ? { uri: getToken(task.asset2)?.logoURI }
                            : require("../../../assets/task-error.png")
                          : vaults!.find(
                              (vault) => vault.name === task.protocol
                            )?.image
                          ? {
                              uri: vaults!.find(
                                (vault) => vault.name === task.protocol
                              )?.image,
                            }
                          : require("../../../assets/task-error.png")
                      }
                    />
                  )}
                </View>
                <View>
                  <Image
                    className="mr-1 h-8 w-8"
                    source={
                      // task is 1 or 0
                      task.state === 1 || task.state === 0
                        ? colorScheme == "light"
                          ? require("../../../assets/task-1.png")
                          : require("../../../assets/task-1-drk.png")
                        : task.state === 2
                        ? colorScheme == "light"
                          ? require("../../../assets/task-2.png")
                          : require("../../../assets/task-2-drk.png")
                        : colorScheme == "light"
                        ? require("../../../assets/task-error.png")
                        : require("../../../assets/task-error-drk.png")
                    }
                  />
                </View>
              </View>
            ))
        ) : (
          <Text className="text-s font-bold text-typo2-light dark:text-typo2-dark">
            {t("noTxFound")}
          </Text>
        )}

        {/* tasks that have state = 2 */}
        <Text className="m-4 text-lg font-bold text-typo2-light dark:text-typo2-dark ">
          {t("completed")}
        </Text>
        {tasks.length !== 0 ? (
          tasks
            .filter((task) => task.state === 2 || task.state == -20)
            .sort((b, a) => a.id.localeCompare(b.id))
            .map((task, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (
                    task.txHash != null &&
                    task.txHash != undefined &&
                    task.txHash != ""
                  )
                    Linking.openURL(etherscanLink(task.chainId, task.txHash));
                }}
                key={index}
              >
                <View
                  className={
                    index % 2 == 0
                      ? "flex flex-row items-center justify-between bg-secondary-light p-3 dark:bg-secondary-dark "
                      : "flex flex-row items-center justify-between bg-primary-light p-3 dark:bg-primary-dark "
                  }
                >
                  <View className="flex-row items-center py-2 px-2">
                    <Image
                      className="h-8 w-8"
                      source={
                        task.type === "Swap"
                          ? colorScheme == "light"
                            ? require("../../../assets/swap.png")
                            : require("../../../assets/swap-drk.png")
                          : task.type === "Invest"
                          ? colorScheme == "light"
                            ? require("../../../assets/seed.png")
                            : require("../../../assets/seed-drk.png")
                          : task.type === "send"
                          ? colorScheme == "light"
                            ? require("../../../assets/send.png")
                            : require("../../../assets/send-drk.png")
                          : colorScheme == "light"
                          ? require("../../../assets/receive.png")
                          : require("../../../assets/receive-drk.png")
                      }
                    />
                  </View>
                  <View className="flex-row">
                    <Text className="font-bold text-typo2-light dark:text-typo2-dark">
                      {cutDecimals(task.amount, 4)} {}
                    </Text>
                    <Image
                      className="h-5 w-5"
                      source={
                        getToken(task.asset1)?.logoURI
                          ? { uri: getToken(task.asset1)?.logoURI }
                          : require("../../../assets/task-error.png")
                      }
                    />
                    <Text className="ml-2 font-bold text-typo2-light dark:text-typo2-dark">
                    {task.type === "Swap"
                      ? t("to")
                      : task.type === "Invest"
                      ? t("into")
                      : task.type === "Withdraw"
                      ? t("from")
                      : t("to")}{" "}
                    </Text>
                    {task.type === "send" ? (
                      <Text className="ml-1 font-bold text-typo2-light dark:text-typo2-dark">
                        {task.asset2.substring(0, 6) +
                          "..." +
                          task.asset2.slice(-4)}
                      </Text>
                    ) : (
                      <Image
                        className="ml-1 h-5 w-5"
                        // if swap get asset2 logo else get vault logo from vaults where vault is protocol
                        source={
                          task.type === "Swap"
                            ? getToken(task.asset2)?.logoURI
                              ? { uri: getToken(task.asset2)?.logoURI }
                              : require("../../../assets/task-error.png")
                            : vaults!.find(
                                (vault) => vault.name === task.protocol
                              )?.image
                            ? {
                                uri: vaults!.find(
                                  (vault) => vault.name === task.protocol
                                )?.image,
                              }
                            : require("../../../assets/task-error.png")
                        }
                      />
                    )}
                  </View>
                  <View>
                    <Image
                      className="mr-1 h-8 w-8"
                      source={
                        // task is 1 or 0
                        task.state === 1 || task.state === 0
                          ? colorScheme == "light"
                            ? require("../../../assets/task-1.png")
                            : require("../../../assets/task-1-drk.png")
                          : task.state === 2
                          ? colorScheme == "light"
                            ? require("../../../assets/task-2.png")
                            : require("../../../assets/task-2-drk.png")
                          : colorScheme == "light"
                          ? require("../../../assets/task-error.png")
                          : require("../../../assets/task-error-drk.png")
                      }
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))
        ) : (
          <Text className="text-s font-bold text-typo2-light dark:text-typo2-dark">
            {t("noTxFound")}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default History;
