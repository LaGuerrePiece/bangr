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

type VaultParams = {
  VaultScreen: {
    name: string;
    description: string;
    apy: string;
    color: string;
    protocol: string;
  };
};

const VaultScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<VaultParams, "VaultScreen">>();
  const { name, description, apy, color, protocol } = params;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  });

  const getImage = (name: string) => {
    switch (name) {
      case "RocketPool":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/rpl.png")}
          />
        );
      case "Ethereum":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/ethereum.png")}
          />
        );
      case "GMX":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/glp.png")}
          />
        );
      case "Velodrome":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/velodrome.png")}
          />
        );
    }
  };

  return (
    <View className="h-full bg-primary-light dark:bg-primary-dark">
      <SafeAreaView className="mx-auto w-11/12 rounded-lg p-3">
        <View className="my-6">
          <TouchableWithoutFeedback onPress={navigation.goBack}>
            <XMarkIcon size={36} />
          </TouchableWithoutFeedback>
        </View>
        <View className="flex">
          <View className="mb-6 flex-row justify-between">
            <View className="w-4/5">
              <View className="flex-row items-center">
                <Text className="text-3xl font-bold text-typo-light dark:text-typo-dark">
                  {name}
                </Text>
              </View>
              <Text className="text-gray-500">{description}</Text>
            </View>
            {getImage(protocol)}
          </View>
          <Text className="mt-2 text-typo-light dark:text-typo-dark">
            GMX is a platform on which traders can bet on whether assets like
            BTC or ETH will go up or down. When a trader makes a bet, the GLP
            pool takes the opposite position, meaning it wins if the trader
            looses and looses in the trader wins.
          </Text>
          <Text className="mt-2 text-typo-light dark:text-typo-dark">
            {" "}
            By providing liquidity to GMX, you will earn the money traders
            loose. Additionally, you will earn fees the traders pay for using
            the platform in all cases. However, if they win money on average,
            the APY can be lowered or even go below 0. Here is the APY history :
          </Text>
          <View className="mt-2">
            <Text className="text-2xl font-bold text-typo-light dark:text-typo-dark">
              Current APY: {apy}%
            </Text>
          </View>
          <Text className="mt-2 text-typo-light dark:text-typo-dark">
            Keep in mind that when entering this vault, you will be exposed to
            the assets that GLP is made of. Here is its current composition:
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default VaultScreen;
