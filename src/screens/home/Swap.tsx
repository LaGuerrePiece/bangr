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
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import Asset from "../../components/Asset";

type ButtonStatus = {
  disabled: boolean;
  text: string;
};

const Swap = ({ swiper }: { swiper: any }) => {
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
    isSearching,
    update,
    set,
    clearAfterSwap,
  } = useSwapStore();
  const tokens = useTokensStore((state) => state.tokens);
  const colorScheme = useColorScheme();

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
      amountIn: "",
      debouncedAmountIn: "",
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
      await relay(
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
        text1: "error relaying transaction",
      });
    }
    clearAfterSwap();
    fetchBalances();
  };

  // test
  const swapAndInvest = async () => {
    if (!calls || !wallet || !quote || !smartWalletAddress) return;
    const value = getRelayerValueToSend(quote);
    const type = "Swap";
    const protocol = "bangrswap";
    const asset1 = srcToken!.symbol;
    const asset2 = dstToken!.symbol;
    const amount = amountIn;
    const dcalls = await axios.post(`${getURLInApp()}/api/v1/quote/swap`, {
      srcToken: dstToken,
      dstToken: srcToken,
      amountIn: ethers.utils.parseUnits(quote.sumOfToAmount!),
      fromAddress: EXAMPLE_WALLET_ADDRESS,
    });
    try {
      Promise.all([
        relay(
          calls,
          wallet,
          smartWalletAddress,
          value,
          type,
          protocol,
          asset1,
          asset2,
          "2",
          successMessage,
          errorMessage
        ),
        relay(
          dcalls.data,
          wallet,
          smartWalletAddress,
          "0",
          type,
          protocol,
          asset2,
          asset1,
          "1",
          "🦄 Invest successful!",
          "🤯 Invest failed. Please try again later or contact us."
        ),
      ]);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "error relaying transaction",
      });
    }
    clearAfterSwap();
    fetchBalances();
    console.log("swap and invest done");
  };

  const buttonStatus = (): ButtonStatus => {
    if (!debouncedAmountIn) {
      return {
        disabled: true,
        text: "Enter amount",
      };
    } else if (
      Number(debouncedAmountIn) * (srcToken?.priceUSD ?? 0) <
      SWAPAMOUNTIN_USD_THRESHOLD
    ) {
      return {
        disabled: true,
        text: `Amount too small`,
      };
    } else if (
      srcToken &&
      ethers.utils
        .parseUnits(debouncedAmountIn, srcToken.decimals)
        .gt(srcToken.balance ?? "0")
    ) {
      return {
        disabled: true,
        text: `Insufficient balance`,
      };
    } else if (isSearching) {
      return {
        disabled: true,
        text: "Computing route...",
      };
    } else if (!calls) {
      return {
        disabled: true,
        text: "No route found",
      };
    } else {
      return {
        disabled: false,
        text: "Swap",
      };
    }
  };

  return (
    <SafeAreaView className="h-full bg-secondary-light dark:bg-secondary-dark">
      <View className="mx-auto mt-4 w-11/12 items-center">
        <View className="w-full flex-row justify-between">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              console.log("history");
              swiper.current.scrollBy(-1, true);
            }}
          >
            <Image
              className="h-7 w-7"
              source={
                colorScheme === "dark"
                  ? require("../../../assets/history-drk.png")
                  : require("../../../assets/history.png")
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              console.log("Invest");
              swiper.current.scrollBy(1, true);
            }}
          >
            <Image
              className="h-7 w-7"
              source={
                colorScheme === "dark"
                  ? require("../../../assets/pochicon-drk.png")
                  : require("../../../assets/pochicon.png")
              }
            />
          </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <Text className="text-center text-5xl font-bold text-typo-light dark:text-typo-dark">
              Swap
            </Text>
            <View className="mx-auto my-3 w-full items-center rounded-xl bg-secondary-light dark:bg-secondary-dark">
              <View className="w-full flex-row justify-between p-2">
                <View className="ml-1 justify-end">
                  {srcToken && tokens && (
                    <SelectTokenButton
                      tokens={tokens}
                      selectedToken={srcToken}
                      tokenToUpdate={"Swap:srcToken"}
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
                      Balance:{" "}
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

              <View
                className="h-20 w-full flex-row justify-between rounded-br-xl rounded-bl-xl border-t
            border-typo-dark
            bg-secondary-light pt-1
            dark:border-typo-dark 
            dark:bg-secondary-dark"
              >
                <View className="ml-1 p-2">
                  {dstToken && tokens && (
                    <SelectTokenButton
                      tokens={tokens.filter(
                        (t) => !["ETH", "MATIC"].includes(t.symbol)
                      )} // quite dirty
                      selectedToken={dstToken}
                      tokenToUpdate={"Swap:dstToken"}
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
            <View className="flex flex-row">
              <TouchableHighlight onPress={flip}>
                <View className="flex flex-row items-center">
                  <Image
                    className="ml-3 mb-4 h-6 w-6"
                    source={
                      colorScheme === "light"
                        ? require("../../../assets/flip.png")
                        : require("../../../assets/flip_white.png")
                    }
                  />
                  <Text className="font-bold text-typo-light dark:text-typo-dark">
                    Flip
                  </Text>
                </View>
              </TouchableHighlight>
            </View>

            <View className="flex-row justify-evenly">
              <ActionButton
                text={buttonStatus().text}
                disabled={buttonStatus().disabled}
                action={swap}
              />
            </View>
          </>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

export default Swap;
