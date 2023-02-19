import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import Chart, { Point } from "../components/Chart";
import { MultichainToken } from "../types/types";
import { formatUnits, cutDecimals } from "../utils/format";
import axios from "axios";
import { getURLInApp } from "../utils/utils";
import ActionButton from "../components/ActionButton";
import useSendStore from "../state/send";
import useSwapStore from "../state/swap";
import useTabStore from "../state/tab";
import { colors } from "../config/configs";

type TokenParams = {
  TokenScreen: {
    token: MultichainToken;
  };
};

const TokenScreen = () => {
  const navigation = useNavigation();
  const setTab = useTabStore((state) => state.setTab);
  const colorScheme = useColorScheme();

  const { params } = useRoute<RouteProp<TokenParams, "TokenScreen">>();
  const { token } = params;
  const [chart, setChart] = useState<Point[]>();
  const updateSendStore = useSendStore((state) => state.update);
  const updateSwapSrcToken = useSwapStore((state) => state.updateSrcToken);

  useEffect(() => {
    getChart(token);
  }, [token]);

  async function getChart(token: MultichainToken) {
    const firstChain = token.chains[0];
    try {
      const { data } = (await axios.post(`${getURLInApp()}/api/v1/chart`, {
        tokenAddress: firstChain.address,
        chainId: firstChain.chainId,
        days: 1,
      })) as {
        data: Point[];
      };

      const lessData = [];
      //remove two out of three points
      for (let i = 0; i < data.length; i++) {
        if (i % 5 === 0) {
          lessData.push(data[i]);
        }
      }

      console.log(`fetched chart for ${token.symbol}`);
      setChart(lessData);
    } catch (error) {
      console.log("error fetching chart:", error);
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  });

  const swap = () => {
    navigation.navigate("Wallet" as never, {} as never);
    updateSwapSrcToken(token);
    setTab("Swap");
  };

  const send = () => {
    navigation.navigate("Send" as never, {} as never);
    updateSendStore({ token: token });
  };

  return (
    <View className="h-full bg-primary-light py-6 dark:bg-primary-dark">
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
      <SafeAreaView className="rounded-lg p-3">
        <View className="flex items-center">
          <Image
            className="h-10 w-10"
            source={
              token.logoURI
                ? { uri: token.logoURI }
                : require("../../assets/poche.png")
            }
          />
          <Text className="p-1 text-center text-2xl font-bold text-typo-light dark:text-typo-dark">
            {token.name}
          </Text>
          <Text className="text-2xl font-bold text-typo-light dark:text-typo-dark">
            ${token.priceUSD}
          </Text>
        </View>
        <View className="my-4 rounded-lg bg-secondary-light dark:bg-secondary-dark">
          {chart ? <Chart chart={chart} /> : <ActivityIndicator />}
        </View>

        <View className="mt-2 rounded-lg bg-secondary-light p-3 dark:bg-secondary-dark">
          <View className="flex-row justify-between">
            <Text className="text-2xl font-semibold text-typo-light dark:text-typo-dark">
              Balance
            </Text>
            <View className="flex items-end">
              <Text className="text-lg font-bold text-typo-light dark:text-typo-dark">
                ${cutDecimals(token.quote || 0, 2)}
              </Text>
              <Text className="mt-1 text-gray-500">
                {formatUnits(token.balance, token.decimals, 4)} {token.symbol}
              </Text>
            </View>
          </View>
        </View>

        <View className="my-6 flex-row justify-evenly">
          <ActionButton
            text="Swap"
            disabled={false}
            action={swap}
            icon={require("../../assets/flip_white.png")}
          />
          <ActionButton
            text="Send"
            disabled={false}
            action={send}
            icon={require("../../assets/arrow_up_white.png")}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TokenScreen;
