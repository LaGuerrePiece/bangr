import { useEffect } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  TouchableHighlight,
  useColorScheme,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import ActionButton from "../../components/ActionButton";
import SelectTokenButton from "../../components/SelectTokenButton";
import {
  EXAMPLE_WALLET_ADDRESS,
  SWAPAMOUNTIN_USD_THRESHOLD,
  SWAP_DEBOUNCE_THRESHOLD,
  colors,
} from "../../config/configs";
import useUserStore from "../../state/user";
import "@ethersproject/shims";
import { ethers } from "ethers";
import {
  getExampleMultichainToken,
  getRelayerValueToSend,
} from "../../utils/utils";
import { correctInput, getURLInApp } from "../../utils/utils";
import axios from "axios";
import useTokensStore from "../../state/tokens";
import { cutDecimals, formatUnits } from "../../utils/format";
import { Placeholder, PlaceholderLine, Shine } from "rn-placeholder";
import useSwapStore from "../../state/swap";
import { relay } from "../../utils/signAndRelay";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import * as Haptics from "expo-haptics";
import { MultichainToken } from "../../types/types";
import useTasksStore from "../../state/tasks";
import { CompositeScreenProps } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Icon from "../../components/Icon";
import { MainScreenStackParamList } from "../MainScreen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { useTranslation } from "react-i18next";

type ButtonStatus = {
  disabled: boolean;
  text: string;
};

const Swap = ({
  navigation,
  route,
}: CompositeScreenProps<
  NativeStackScreenProps<MainScreenStackParamList, "Swap">,
  NativeStackScreenProps<RootStackParamList>
>) => {
  const { t } = useTranslation();
  const { repeatFetchTasks } = useTasksStore((state) => ({
    repeatFetchTasks: state.repeatFetchTasks,
  }));

  const { smartWalletAddress, wallet, fetchBalances } = useUserStore(
    (state) => ({
      smartWalletAddress: state.smartWalletAddress,
      wallet: state.wallet,
      fetchBalances: state.fetchBalances,
    })
  );
  const {
    amountIn,
    debouncedAmountIn,
    srcToken,
    dstToken,
    quote,
    calls,
    gasFeeEstimateUSD,
    isSearching,
    update,
    set,
    clearAfterSwap,
  } = useSwapStore();
  const tokens = useTokensStore((state) => state.tokens);
  const fetchTasks = useTasksStore((state) => state.fetchTasks);

  const colorScheme = useColorScheme();

  useEffect(() => {
    const updatedToken = route.params?.updatedToken;
    const tokenToUpdate = route.params?.tokenToUpdate;

    if (updatedToken && tokenToUpdate) {
      if (
        tokenToUpdate === "srcToken" &&
        updatedToken.symbol === dstToken?.symbol
      ) {
        flip();
        return;
      }
      if (
        tokenToUpdate === "dstToken" &&
        updatedToken.symbol === srcToken?.symbol
      ) {
        flip();
        return;
      }
      update({ [tokenToUpdate]: updatedToken });
    }
  }, [route.params?.updatedToken, route.params?.tokenToUpdate]);

  useEffect(() => {
    if (!srcToken) {
      const dai = tokens?.find((token) => token.symbol === "DAI");
      if (dai) update({ srcToken: dai });
    }
    if (!dstToken) {
      const usdc = tokens?.find((token) => token.symbol === "USDC");
      if (usdc) update({ dstToken: usdc });
    }
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      set({ debouncedAmountIn: amountIn });
    }, SWAP_DEBOUNCE_THRESHOLD);
    return () => {
      clearTimeout(handler);
    };
  }, [amountIn]);

  useEffect(() => {
    if (debouncedAmountIn) updateQuote();
  }, [debouncedAmountIn, srcToken, dstToken]);

  async function updateQuote() {
    if (!debouncedAmountIn || !srcToken || !dstToken) return;
    if (
      Number(debouncedAmountIn) * (srcToken.priceUSD ?? 0) <
      SWAPAMOUNTIN_USD_THRESHOLD
    ) {
      console.log(
        `amountIn ${debouncedAmountIn} below $${SWAPAMOUNTIN_USD_THRESHOLD} so cannot quote`
      );
      return;
    }

    const formattedAmountIn = ethers.utils
      .parseUnits(debouncedAmountIn, srcToken.decimals)
      .toString();

    update({ quote: null, calls: null, isSearching: true });

    // if user does not have enough, put example balances so he can see the quote
    const token =
      Number(srcToken.balance) < Number(formattedAmountIn)
        ? getExampleMultichainToken(srcToken, formattedAmountIn)
        : srcToken;

    try {
      const { data: response } = await axios.post(
        `${getURLInApp()}/api/v1/quote/swap`,
        {
          srcToken: token,
          dstToken: dstToken,
          amountIn: formattedAmountIn,
          fromAddress: smartWalletAddress ?? EXAMPLE_WALLET_ADDRESS,
        }
      );
      update({
        quote: response.infos.quote,
        calls: response.calls,
        gasFeeEstimateUSD: response.infos.gasFeeEstimateUSD,
        isSearching: false,
      });
    } catch (error) {
      console.log(error);
      update({ isSearching: false });
    }
  }

  const flip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let srcTokenSave = srcToken;
    if (srcTokenSave && ["ETH", "MATIC"].includes(srcTokenSave.symbol)) {
      const dai = tokens?.find((token) => token.symbol === "DAI");
      if (dai) srcTokenSave = dai;
    }

    update({
      // causes bugs for now with USDC
      // amountIn: quote?.sumOfToAmount
      //   ? cutDecimals(quote.sumOfToAmount, 5).slice(0, 9)
      //   : "0",
      amountIn: "0",
      debouncedAmountIn: "0",
      quote: null,
      calls: null,
      srcToken: dstToken,
      dstToken: srcTokenSave,
    });
  };

  const handleInputChange = (event: any) => {
    event = correctInput(event);
    if (event < 0) event = 0;
    update({
      amountIn: event.toString(),
    });
  };

  const max = () => {
    if (!srcToken) return;
    update({
      amountIn: ethers.utils.formatUnits(
        srcToken.balance ?? "0",
        srcToken.decimals
      ),
    });
  };

  const successMessage = "🦄 Swap successful!";
  const errorMessage = "🤯 Swap failed. Please try again later or contact us.";

  const swap = async () => {
    if (!calls || !wallet || !quote || !smartWalletAddress) return;
    const value = getRelayerValueToSend(quote);
    const type = "Swap";
    const protocol = "bangrswap";
    const asset1 = srcToken!.symbol;
    const asset2 = dstToken!.symbol;
    const amount = amountIn;
    try {
      relay(
        calls,
        wallet,
        smartWalletAddress,
        value,
        type,
        protocol,
        asset1,
        asset2,
        amount!.toString(),
        successMessage,
        errorMessage
      );
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: t("errorRelayingTransaction") as string,
      });
    }
    clearAfterSwap();
    repeatFetchTasks();
    navigation.navigate("History", { waitingForTask: true });
  };

  const buttonStatus = (): ButtonStatus => {
    if (!debouncedAmountIn) {
      return {
        disabled: true,
        text: t("Enter amount"),
      };
    } else if (
      Number(debouncedAmountIn) * (srcToken?.priceUSD ?? 0) <
      SWAPAMOUNTIN_USD_THRESHOLD
    ) {
      return {
        disabled: true,
        text: t(`Amount too small`),
      };
    } else if (
      srcToken &&
      ethers.utils
        .parseUnits(debouncedAmountIn, srcToken.decimals)
        .gt(srcToken.balance ?? "0")
    ) {
      return {
        disabled: true,
        text: t(`Insufficient balance`),
      };
    } else if (isSearching) {
      return {
        disabled: true,
        text: t("Computing route..."),
      };
    } else if (!calls) {
      return {
        disabled: true,
        text: t("No route found"),
      };
    } else {
      return {
        disabled: false,
        text: t("Swap"),
      };
    }
  };

  return (
    <SafeAreaView className="h-full bg-secondary-light dark:bg-primary-dark">
      <View className="mx-auto w-full items-center bg-primary-light dark:bg-secondary-dark">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View className="mx-auto mt-4 w-full items-center bg-primary-light dark:bg-secondary-dark">
              <Text className="mb-2 text-center font-InterBold text-3xl text-typo-light dark:text-typo-dark">
              {t("Swap")}
              </Text>
            </View>
            <View className="mx-auto  w-full items-center bg-primary-light dark:bg-secondary-dark">
              <View className="w-11/12 flex-row justify-start">
                <Text className="text-md text-typo-light dark:text-typo-dark">
                  {t("spent")}:
                </Text>
              </View>
              <View className="w-full flex-row justify-between p-2">
                <View className="ml-1 justify-end">
                  {srcToken && tokens && (
                    <SelectTokenButton
                      tokens={tokens}
                      selectedToken={srcToken}
                      tokenToUpdate={"srcToken"}
                    />
                  )}
                  <Text className="mt-2 mb-1 text-typo-light dark:text-typo-dark">
                    ${" "}
                    {(Number(amountIn) * (srcToken?.priceUSD ?? 0)).toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-end">
                  <View className="items-end">
                    <Text className="text-xs text-typo-light dark:text-typo-dark">
                      {t("Balance")}:{" "}
                      {formatUnits(srcToken?.balance, srcToken?.decimals, 4)}{" "}
                      {srcToken?.symbol ?? ""}
                    </Text>
                    <View className="flex-row justify-end">
                      <TextInput
                        placeholderTextColor={colors.typo2.light}
                        className="my-1 w-48 text-4xl font-semibold text-typo-light dark:text-typo-dark"
                        onChangeText={handleInputChange}
                        value={amountIn?.slice(0, 10) ?? ""}
                        keyboardType="numeric"
                        placeholder="0"
                        textAlign="right"
                      />
                    </View>
                    <TouchableHighlight onPress={max}>
                      <View className="flex-row items-center">
                        <Image
                          className="mb-1 mr-0.5 h-3 w-3"
                          source={
                            colorScheme === "light"
                              ? require("../../../assets/arrow_up.png")
                              : require("../../../assets/arrow_up_white.png")
                          }
                        />
                        <Text className="font-bold text-typo-light dark:text-typo-dark">
                          Max
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>

              <View className="absolute z-10 mt-24 rounded-2xl bg-secondary-light p-2 dark:bg-primary-dark">
                <TouchableHighlight onPress={flip}>
                  <View className="flex-row items-center">
                    <Image
                      className="h-8 w-8"
                      source={
                        colorScheme === "light"
                          ? require("../../../assets/flip.png")
                          : require("../../../assets/flip_white.png")
                      }
                    />
                  </View>
                </TouchableHighlight>
              </View>

              <View
                className="w-full flex-col justify-start bg-secondary-light 
            dark:bg-primary-dark"
              >
                <View className="flex-row justify-start mt-4 ml-4 mb-6">
                  <Text className="text-typo-light dark:text-typo-dark">
                  {t("received")}:
                  </Text>
                </View>
                <View
                  className="h-20 w-full flex-row justify-between 
            bg-secondary-light pt-1
            dark:bg-primary-dark"
                >
                  <View className="ml-1 p-2">
                    {dstToken && tokens && (
                      <SelectTokenButton
                        tokens={tokens.filter(
                          (t) => !["ETH", "MATIC"].includes(t.symbol)
                        )} // quite dirty
                        selectedToken={dstToken}
                        tokenToUpdate={"dstToken"}
                      />
                    )}
                    <View className="my-2">
                      {isSearching ? (
                        <View className="w-2/3 items-center justify-end">
                          {/* @ts-ignore */}
                          <Placeholder Animation={Shine}>
                            <PlaceholderLine
                              height={9}
                              width={80}
                              className="mt-2"
                              style={
                                colorScheme === "dark"
                                  ? { backgroundColor: "#999999" }
                                  : {}
                              }
                            />
                          </Placeholder>
                        </View>
                      ) : (
                        <Text className="mb-2 text-typo-light dark:text-typo-dark">
                          ${" "}
                          {quote && quote.totalToAmountUSD
                            ? quote.totalToAmountUSD?.toFixed(2)
                            : "0.00"}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View className="flex-row justify-end py-2">
                    {isSearching ? (
                      <View className="w-2/3 items-center justify-end">
                        {/* @ts-ignore */}
                        <Placeholder Animation={Shine}>
                          <PlaceholderLine
                            height={20}
                            width={80}
                            style={
                              colorScheme === "dark"
                                ? { backgroundColor: "#999999" }
                                : {}
                            }
                          />
                        </Placeholder>
                      </View>
                    ) : (
                      <Text className="my-1 text-4xl font-semibold text-typo-light dark:text-typo-dark">
                        {quote && quote.sumOfToAmount
                          ? cutDecimals(quote.sumOfToAmount, 5).slice(0, 9)
                          : "0"}{" "}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <View className="w-full flex-row justify-between bg-secondary-light dark:bg-primary-dark">
                {gasFeeEstimateUSD ? (
                  <TouchableHighlight>
                    <View className="mr-3 flex-row items-center">
                      <Icon
                        icon={(props: any) => (
                          <MaterialIcons
                            name="local-gas-station"
                            size={28}
                            {...props}
                          />
                        )}
                      />
                      <Text className="ml-1 text-typo-light dark:text-typo-dark">
                        {gasFeeEstimateUSD.toFixed(2)} USD
                      </Text>
                    </View>
                  </TouchableHighlight>
                ) : null}
              </View>
              <View className="mx-auto w-full items-center bg-secondary-light pt-12 dark:bg-primary-dark">
                <ActionButton
                  text={buttonStatus().text}
                  rounded
                  bold
                  disabled={buttonStatus().disabled}
                  action={swap}
                />
              </View>
            </View>
          </>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

export default Swap;
