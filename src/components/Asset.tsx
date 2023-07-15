import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
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
import { Investment, MultichainToken, VaultData } from "../types/types";
import { Point } from "./Chart";
import { getURLInApp } from "../utils/utils";
import axios from "axios";
import { LineChart } from "react-native-wagmi-charts";
import useVaultsStore from "../state/vaults";
import useYieldsStore from "../state/yields";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainScreenStackParamList } from "../screens/MainScreen";
import { RootStackParamList } from "../../App";
import { t } from "i18next";

const Asset = ({
  navigation,
  token,
  even,
}: {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<MainScreenStackParamList, "Wallet">,
    NativeStackNavigationProp<RootStackParamList>
  >;
  token: MultichainToken;
  even: boolean;
}) => {
  const [chart, setChart] = useState<Point[]>();
  useEffect(() => {
    getChart(token);
  }, [token]);

  const colorScheme = useColorScheme();
  const vaults = useVaultsStore((state) => state.vaults);
  const yields = useYieldsStore((state) => state.yields);

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
      console.log(`error fetching chart for ${token.symbol}`, error);
    }
  }

  // look for the vault corresponding to the token or where the token is in tokens in of the vault
  const vault = token.vaultToken
    ? vaults?.find((vault) => vault.vaultToken === token.symbol)
    : vaults?.find((vault) => vault.tokensIn.find((t) => t == token.symbol));

  // look for the investment corresponding to the vault
  const investment = token.vaultToken
    ? yields
        ?.map((y) =>
          y.investments.find(
            (investment) => investment.vaultName === vault?.name
          )
        )
        .filter((investment) => investment !== undefined)[0]
    : vault?.vaultToken
    ? yields
        ?.map((y) =>
          y.investments.find(
            (investment) => investment.vaultName === vault?.name
          )
        )
        .filter((investment) => investment !== undefined)[0]
    : undefined;

  // console.log(token.symbol, vault?.name, investment?.name);

  return (
    <View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setHeight(height);
        setWidth(width);
      }}
      className="w-full"
    >
      <TouchableOpacity
        onPress={() => {
          if (token.vaultToken) {
            if (vault && investment) {
              navigation.navigate("VaultWithdrawal", { vault, investment });
            }
          } else {
            if (vault && investment) {
              navigation.navigate("VaultDeposit", { vault, investment });
            }
          }
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
        <View
          className={
            even
              ? "flex-row items-center justify-between bg-secondary-light py-4 px-6 dark:bg-primary-dark"
              : "flex-row items-center justify-between bg-primary-light py-4 px-6 dark:bg-secondary-dark"
          }
        >
          <View className="flex-row items-center">
            {token.vaultToken ? (
              <>
                <View>
                  <Image
                    className="h-12 w-12"
                    source={
                      colorScheme === "dark"
                        ? require("../../assets/vault-drk.png")
                        : require("../../assets/vault.png")
                    }
                  />
                  {investment?.image ? (
                    <Image
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      resizeMode="contain"
                      source={{ uri: investment.image }}
                    />
                  ) : null}
                </View>
                <View className="ml-3">
                  <Text className="font-bold text-typo-light dark:text-typo-dark">
                    {investment?.name}
                  </Text>
                  <Text className="text-typo2-light dark:text-typo2-dark">
                    {Number(
                      ethers.utils.formatUnits(
                        token.balance || 0,
                        token.decimals
                      )
                    ).toFixed(2)}{" "}
                    {token.symbol === "wstETH"
                      ? "ETH"
                      : token.symbol === "aUSDC"
                      ? "USDC"
                      : t("Invested")}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Image
                  className="h-12 w-12 rounded-full"
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
                      ethers.utils.formatUnits(
                        token.balance || 0,
                        token.decimals
                      )
                    ).toFixed(2)}{" "}
                    {token.symbol}
                  </Text>
                </View>
              </>
            )}
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
