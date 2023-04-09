import { useNavigation } from "@react-navigation/native";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { MultichainToken } from "../types/types";
import { Point } from "./Chart";
import { getURLInApp } from "../utils/utils";
import axios from "axios";
import { LineChart } from "react-native-wagmi-charts";

const Asset = ({ token, swiper }: { token: MultichainToken; swiper: any }) => {
  const [chart, setChart] = useState<Point[]>();
  useEffect(() => {
    getChart(token);
  }, [token]);

  const colorScheme = useColorScheme();

  // state with width and height of the chart
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

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

  return (
    <View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setHeight(height);
        setWidth(width);
      }}
    >
      <TouchableOpacity
        onPress={() => {
          // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          swiper.current.scrollBy(-1, true);
        }}
      >
        <View className="absolute ml-8">
          {chart ? (
            <LineChart.Provider data={chart}>
              <LineChart
                width={width - width / 10}
                height={height}
                yGutter={16}
              >
                <LineChart.Path
                  color={colorScheme === "dark" ? token.color : token.color}
                />
                <LineChart.CursorCrosshair />
              </LineChart>
            </LineChart.Provider>
          ) : (
            // <ActivityIndicator />
            <View />
          )}
        </View>
        <View className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center">
            {token.vaultToken ? (
              <View>
                <Image
                  className="h-12 w-12"
                  source={require("../../assets/vaultbtn-selected.png")} // other: vault_1.png
                />
                <Image
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  source={
                    token.logoURI
                      ? { uri: token.logoURI }
                      : require("../../assets/poche.png")
                  }
                />
              </View>
            ) : (
              <Image
                className="h-12 w-12 rounded-full"
                source={
                  token.logoURI
                    ? { uri: token.logoURI }
                    : require("../../assets/poche.png")
                }
              />
            )}
            <View className="ml-3">
              <Text className="font-bold text-typo-light dark:text-typo-dark">
                {token.name}
              </Text>
              <Text className="text-typo2-light dark:text-typo2-dark">
                {token.vaultToken
                  ? "Vault"
                  : `${Number(
                      ethers.utils.formatUnits(
                        token.balance || 0,
                        token.decimals
                      )
                    ).toFixed(2)} ${token.symbol}`}
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
