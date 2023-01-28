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
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import Chart, { Point } from "../components/Chart";
import { MultichainToken } from "../types/types";
import { formatUnits, cutDecimals } from "../utils/format";
import axios from "axios";
import { getURLInApp } from "../utils/utils";

type TokenParams = {
  TokenScreen: {
    token: MultichainToken;
  };
};

const TokenScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<TokenParams, "TokenScreen">>();
  const { token } = params;
  const [chart, setChart] = useState<Point[]>();

  useEffect(() => {
    getChart(token);
  }, [token]);

  async function getChart(token: MultichainToken) {
    const firstChain = token.chains[0];
    try {
      const { data } = (await axios.post(`${getURLInApp()}/api/chart`, {
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

  return (
    <View className="h-full bg-primary-light dark:bg-primary-dark">
      <SafeAreaView className="mx-auto w-11/12 rounded-lg p-3">
        <View className="my-6">
          <TouchableWithoutFeedback onPress={navigation.goBack}>
            <XMarkIcon size={36} />
          </TouchableWithoutFeedback>
        </View>
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

        <View className="rounded-lg bg-secondary-light dark:bg-secondary-dark">
          {chart ? <Chart chart={chart} /> : <ActivityIndicator />}
        </View>

        <View className="mt-8 rounded-lg bg-secondary-light p-3 dark:bg-secondary-dark">
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

        {/* <View className="my-16 flex-row justify-evenly">
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
        </View> */}
      </SafeAreaView>
    </View>
  );
};

export default TokenScreen;
