import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  useColorScheme,
  StatusBar,
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
import * as Haptics from "expo-haptics";
import Swiper from "react-native-swiper";
import Swap from "./home/Swap";
import TokenModal from "../components/TokenModal";
import Invest from "./home/Invest";

const TokenScreen = () => {
  const colorScheme = useColorScheme();

  const dot = (
    <View
      style={{
        backgroundColor: "rgba(0,0,0,.2)",
        width: 12,
        height: 12,
        borderRadius: 8,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 3,
        marginBottom: 3,
      }}
    />
  );

  const activeDot = (
    <View
      style={{
        backgroundColor: colorScheme === "light" ? "black" : "white",
        width: 12,
        height: 12,
        borderRadius: 8,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 3,
        marginBottom: 3,
      }}
    />
  );
  return (
    <Swiper
      loop={false}
      showsPagination={true}
      index={1}
      showsButtons={false}
      dot={dot}
      activeDot={activeDot}
      onMomentumScrollEnd={() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }}
    >
      <View className="m-auto w-full grow dark:bg-primary-dark">
        <Swap />
      </View>
      <View className="items-center bg-secondary-light dark:bg-primary-dark">
        <View className="flex h-full w-11/12 justify-between bg-secondary-light  dark:bg-primary-dark">
          <View className="m-auto w-full grow">
            <TokenModal />
          </View>
        </View>
      </View>
      <View className="items-center bg-secondary-light dark:bg-primary-dark">
        <View className="dark:bg-primary-dark">
          <Invest />
        </View>
      </View>
    </Swiper>
  );
};

export default TokenScreen;
