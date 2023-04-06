import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import {
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { XMarkIcon } from "react-native-heroicons/outline";
import { colors } from "../config/configs";
import useTasksStore from "../state/tasks";
import ActionButton from "../components/ActionButton";
import useUserStore from "../state/user";
import * as Haptics from "expo-haptics";
import { cutDecimals } from "../utils/format";

const HistoryScreen = ({ swiper }: { swiper: any }) => {
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const { tasks, fetchTasks } = useTasksStore((state) => ({
    tasks: state.tasks,
    fetchTasks: state.fetchTasks,
  }));

  // get user scwAddress
  const scw = useUserStore((state) => state.smartWalletAddress);

  useEffect(() => {
    if (!scw) return;
    fetchTasks(); //fetch the tasks
    console.log("fetching tasks");
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, []);

  tasks.forEach((task) => {
    console.log(task.type);
  });

  return (
    <SafeAreaView className="h-full items-center bg-secondary-light dark:bg-primary-dark">
      <View className="mx-auto mt-4 w-11/12 items-center rounded-xl">
        <View className="w-full flex-row justify-end">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              swiper.current.scrollBy(1, true);
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
        {tasks.length !== 0 ? (
          tasks
            .slice(0)
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
                        ? (colorScheme == "light" ? require("../../assets/swap.png") : require("../../assets/swap-drk.png"))
                        : task.type === "Invest"
                        ? (colorScheme == "light" ? require("../../assets/invest.png") : require("../../assets/invest-drk.png"))
                        : (colorScheme == "light" ? require("../../assets/receive.png") : require("../../assets/receive-drk.png"))
                    }
                  />
                </View>
                <View className="flex-row">
                  {/* <Image
                  className="h-5 w-5"
                  source={require("../../assets/" + task.asset1 + ".png")}
                  /> */}

                  <Text className="ml-4 font-bold text-typo2-light dark:text-typo2-dark">
                    {/* {task.type}
                    {"ed "} */}
                    {cutDecimals(task.amount, 2)} {task.asset1} {""}
                    {task.type === "Invest"
                      ? "into"
                      : task.type === "Withdraw"
                      ? "from"
                      : "to"}{" "}
                    {task.type === "Swap"
                      ? task.asset2
                      : task.type === "Invest"
                      ? task.protocol
                      : task.type === "Withdraw"
                      ? task.protocol
                      : task.asset2}
                    {/* {task.protocol} */}
                  </Text>
                </View>
                <View>
                  <Image
                    className="mr-1 h-8 w-8"
                    source={
                      // task is 1 or 0
                      task.state === 1 || task.state === 0
                        ? (colorScheme == "light" ? require("../../assets/task-1.png") : require("../../assets/task-1-drk.png"))
                        : task.state === 2
                        ? (colorScheme == "light" ? require("../../assets/task-2.png") : require("../../assets/task-2-drk.png"))
                        : (colorScheme == "light" ? require("../../assets/task-error.png") : require("../../assets/task-error-drk.png"))
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
