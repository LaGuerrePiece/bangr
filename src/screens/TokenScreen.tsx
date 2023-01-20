import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { XMarkIcon } from "react-native-heroicons/outline";
import ActionButton from "../components/ActionButton";
import Chart from "../components/Chart";
import { NavBar } from "../components/NavBar";
import useUserStore from "../state/user";
import { MultichainToken } from "../types/types";

type TokenParams = {
  TokenScreen: {
    token: MultichainToken;
  };
};

const TokenScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<TokenParams, "TokenScreen">>();
  const { token } = params;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  });

  return (
    <View className="h-full bg-primary-light dark:bg-primary-dark">
      <SafeAreaView className="mx-auto w-11/12 rounded-lg p-3">
        <View className="my-6">
          <TouchableWithoutFeedback onPress={navigation.goBack}>
            <XMarkIcon size={36} />
          </TouchableWithoutFeedback>
        </View>
        <Text className="text-center text-3xl font-bold text-typo-light dark:text-typo-dark">
          {token.name}
        </Text>

        <View className="m-auto w-11/12 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-typo-light dark:text-typo-dark">
              {token.symbol}
            </Text>
            <Text className="text-3xl font-bold text-typo-light dark:text-typo-dark">
              ${token.priceUSD}
            </Text>
          </View>
          <Image
            className="h-12 w-12"
            source={
              token.logoURI
                ? { uri: token.logoURI }
                : require("../../assets/poche.png")
            }
          />
        </View>

        <View className="mt-8 h-36 items-center justify-center rounded-lg bg-secondary-light dark:bg-secondary-dark">
          <Chart />
        </View>

        <View className="mt-8 rounded-lg bg-secondary-light p-3 dark:bg-secondary-dark">
          <View className="flex-row justify-between">
            <Text className="font-bold text-typo-light dark:text-typo-dark">
              Balance
            </Text>
            <View>
              <Text className="font-bold text-typo-light dark:text-typo-dark">
                ${token.quote}
              </Text>
              <Text className="mt-1 text-gray-500">0 {token.symbol}</Text>
            </View>
          </View>
        </View>

        <View className="my-16 flex-row justify-evenly">
          <TouchableOpacity>
            <Image
              className="h-14 w-14"
              source={require("../../assets/buy.png")}
            />
            <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
              Buy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              className="h-14 w-14"
              source={require("../../assets/sell.png")}
            />
            <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
              Sell
            </Text>
          </TouchableOpacity>
        </View>

        <View className="m-auto w-1/2">
          <ActionButton
            text="CLOSE"
            disabled={false}
            action={navigation.goBack}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TokenScreen;
