import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { XMarkIcon } from "react-native-heroicons/outline";
import { colors } from "../config/configs";
import useTasksStore from "../state/tasks";
import ActionButton from "../components/ActionButton";
import useUserStore from "../state/user";

const HistoryScreen = () => {
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
    fetchTasks(scw); //fetch the tasks
  }, []);




  return (
    <View className="h-full items-center bg-primary-light py-6 dark:bg-primary-dark">
      <TouchableWithoutFeedback onPress={navigation.goBack}>
        <View className="mx-auto w-11/12">
          <XMarkIcon
            size={36}
            color={
              colorScheme === "light" ? colors.typo.light : colors.typo.dark
            }
          />
        </View>
      </TouchableWithoutFeedback>
      <ScrollView className="mx-auto mt-5 w-11/12 rounded-lg p-3">
        <Text className="text-s font-bold text-typo2-light dark:text-typo2-dark">
          Pending
        </Text>
        {tasks.length !== 0 ? (
          tasks.map((task, index) => (
            <View
              className="my-1 flex flex-row items-center justify-between rounded-lg bg-secondary-light p-1 dark:bg-secondary-dark"
              key={index}
            >
              <View className="flex-row items-center">
                <Image
                  className="h-8 w-8"
                  source={
                    task.state === 1
                      ? require("../../assets/receivebtn.png")
                      : task.state === 2
                      ? require("../../assets/receivebtn.png")
                      : require("../../assets/receivebtn.png")
                  }
                />
                <Text className="ml-4 font-bold text-typo2-light dark:text-typo2-dark">
                  {task.type}{" "}
                  {task.type === "Deposit"
                    ? "in"
                    : task.type === "Withdraw"
                    ? "from"
                    : "in"}{" "}
                  {task.protocol}
                </Text>
              </View>
              <Image
                className="h-8 w-8"
                source={require("../../assets/rpl.png")}
              />
            </View>
          ))
        ) : (
          <Text className="text-s font-bold text-typo2-light dark:text-typo2-dark">
            No transaction yet
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;
