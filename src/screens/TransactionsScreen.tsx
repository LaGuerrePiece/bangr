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
import useTransactionsStore from "../state/transactions";
import ActionButton from "../components/ActionButton";

const TransactionsScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  });
  const colorScheme = useColorScheme();
  const { transactions, addTransactions } = useTransactionsStore((state) => ({
    transactions: state.transactions,
    addTransactions: state.addTransactions,
  }));

  const addTxs = () => {
    addTransactions(
      {
        type: "Deposit",
        protocol: "Rocket Pool",
        status: "pending",
      },
      {
        type: "Withdraw",
        protocol: "GLP",
        status: "success",
      },
      {
        type: "Deposit",
        protocol: "jETH",
        status: "failure",
      },
      {
        type: "Deposit",
        protocol: "Rocket Pool",
        status: "success",
      }
    );
  };

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
        <ActionButton text="Add Transactions" action={addTxs} />
        <Text className="text-s font-bold text-typo2-light dark:text-typo2-dark">
          Pending
        </Text>
        {transactions.length !== 0 ? (
          transactions.map((transaction, index) => (
            <View
              className="my-1 flex flex-row items-center justify-between rounded-lg bg-secondary-light p-1 dark:bg-secondary-dark"
              key={index}
            >
              <View className="flex-row items-center">
                <Image
                  className="h-8 w-8"
                  source={
                    transaction.status === "success"
                      ? require("../../assets/receivebtn.png")
                      : transaction.status === "pending"
                      ? require("../../assets/receivebtn.png")
                      : require("../../assets/receivebtn.png")
                  }
                />
                <Text className="ml-4 font-bold text-typo2-light dark:text-typo2-dark">
                  {transaction.type}{" "}
                  {transaction.type === "Deposit"
                    ? "in"
                    : transaction.type === "Withdraw"
                    ? "from"
                    : "in"}{" "}
                  {transaction.protocol}
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
            No transactions yet
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default TransactionsScreen;
