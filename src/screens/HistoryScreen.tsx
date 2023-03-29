import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
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

const HistoryScreen = ({ swiper }: { swiper: any }) => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  });
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

  return (
    <View className="">
      <View className="h-full items-center bg-primary-light py-6 dark:bg-primary-dark">
        <View className="mx-auto mt-4 w-11/12 items-center rounded-xl">
          <View className="w-full flex-row">
            <View className="w-1/2">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  console.log("history");
                  swiper.current.scrollBy(-1, true);
                }}
              >
                <Image
                  className="mr-auto h-7 w-7"
                  source={
                    colorScheme === "dark"
                      ? require("../../assets/history-drk.png")
                      : require("../../assets/history.png")
                  }
                />
              </TouchableOpacity>
            </View>
            <View className="w-1/2">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  console.log("Invest");
                  swiper.current.scrollBy(1, true);
                }}
              >
                <Image
                  className="ml-auto h-7 w-7"
                  source={
                    colorScheme === "dark"
                      ? require("../../assets/pochicon-drk.png")
                      : require("../../assets/pochicon.png")
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView
          className="mx-auto mt-5 w-11/12 rounded-lg"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {tasks.forEach((task) => {
            console.log(task.type);
          })}
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
                          ? require("../../assets/swap.png")
                          : task.type === "Invest"
                          ? require("../../assets/invest.png")
                          : require("../../assets/receivebtn.png")
                      }
                    />
                  </View>
                  <View className="flex-row">
                    {/* <Image
                  className="h-5 w-5"
                  source={require("../../assets/" + task.asset1 + ".png")}
                  /> */}

                    <Text className="ml-4 font-bold text-typo2-light dark:text-typo2-dark">
                      {task.type}
                      {"ed "}
                      {task.amount} {task.asset1} {""}
                      {task.type === "Invest"
                        ? "into"
                        : task.type === "Withdraw"
                        ? "from"
                        : "to"}{" "}
                      {task.type === "Swap" ? task.asset2 : task.type === "Invest" ? task.protocol: task.asset2}
                      {/* {task.protocol} */}
                    </Text>
                  </View>
                  <View>
                    <Image
                      className="mr-1 h-8 w-8"
                      source={
                        // task is 1 or 0
                        task.state === 1 || task.state === 0
                          ? require("../../assets/task-1.png")
                          : task.state === 2
                          ? require("../../assets/task-2.png")
                          : require("../../assets/task-error.png")
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
      </View>
    </View>
  );
};

export default HistoryScreen;
