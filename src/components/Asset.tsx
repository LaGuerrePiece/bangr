import { useNavigation } from "@react-navigation/native";
import { ethers } from "ethers";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { PanGestureHandler, ScrollView, State } from "react-native-gesture-handler";
import Animated, {
  add,
  clockRunning,
  cond,
  debug,
  divide,
  eq,
  floor,
  not,
  set,
  useCode,
} from "react-native-reanimated";
import { MultichainToken } from "../types/types";
//@ts-ignore
import Swipeable from "react-native-swipeable-rtl";
import useTabStore from "../state/tab";

const Asset = ({ token }: { token: MultichainToken }) => {
  const { tab, setTab } = useTabStore();
  const navigation = useNavigation();


  const leftContent = [
    <View className="flex-row items-center justify-between">

    <Image
    className="mx-auto my-3 h-7 w-7"
    source={
  require("../../assets/bangrs-selected.png")
    }
  />
  </View>
  ]
  const rightContent = [
    <Image
    className="mx-auto my-3 h-7 w-7"
    source={
  require("../../assets/swap-selected.png")
    }
  />

  ]

  return (
    <Swipeable
    onRef={(ref: any) => (ref = ref)}
    leftContent={leftContent}
    rightContent={rightContent}
    leftActionActivationDistance={50}
    rightActionActivationDistance={50}
    onRightActionRelease={() => navigation.navigate("Swap" as never, { token } as never)}
    onLeftActionRelease={() => navigation.navigate("Invest" as never, { token } as never)}
  >
    <TouchableOpacity
      onPress={() => navigation.navigate("Token" as never, { token } as never)}
    >
    <View className="flex-row items-center justify-between py-3">
        <View className="flex-row items-center">
          <Image
            className="h-12 w-12"
            source={
              token.logoURI
                ? { uri: token.logoURI }
                : require("../../assets/poche.png")
            }
          />
          <View className="ml-3">
            <Text className="font-bold text-typo-light dark:text-typo-dark">
              {token.name}
            </Text>
            <Text className="text-typo2-light dark:text-typo2-dark">
              {Number(
                ethers.utils.formatUnits(token.balance || 0, token.decimals)
              ).toFixed(2)}{" "}
              {token.symbol}
            </Text>
          </View>
        </View>
        <View>
          <Text className="font-bold text-typo-light dark:text-typo-dark">
            ${token.quote?.toFixed(2) ?? "0.00"}
          </Text>
        </View>
      </View>
      </TouchableOpacity>
    
  </Swipeable>

  );

};

export default Asset;
