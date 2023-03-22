import { useNavigation } from "@react-navigation/native";
import { ethers } from "ethers";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { MultichainToken } from "../types/types";
//@ts-ignore
import useTabStore from "../state/tab";
import * as Haptics from "expo-haptics";

const Asset = ({ token }: { token: MultichainToken }) => {
  const navigation = useNavigation();

  return (
    <View className="">
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate("Token" as never, { token } as never);
      }}
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
    </View>
  );
};

export default Asset;
