import {
  View,
  Text,
  Image,
  useColorScheme,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import useUserStore from "../state/user";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import Toast from "react-native-toast-message";
import ActionButton from "../components/ActionButton";
import SelectTokenButton from "../components/SelectTokenButton";
import SelectChainButton from "../components/SelectChainButton";
import useTokensStore from "../state/tokens";
import useSendStore from "../state/send";
import { useEffect, useLayoutEffect } from "react";
import {
  chainData,
  colors,
  SWAP_DEBOUNCE_THRESHOLD,
  SWAPAMOUNTIN_USD_THRESHOLD,
} from "../config/configs";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { cutDecimals, formatUnits } from "../utils/format";
import { correctInput, getURLInApp } from "../utils/utils";
import axios from "axios";
import {
  getChain,
  getChainWithMaxBalance,
  getRelayerValueToSend,
} from "../utils/utils";
import { relay } from "../utils/signAndRelay";
import { Quote } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import { XMarkIcon } from "react-native-heroicons/outline";

const SendScreen = () => {
  const navigation = useNavigation();
  const {
    amountIn,
    debouncedAmountIn,
    token,
    chainId,
    toAddress,
    quote,
    calls,
    isSearching,
    update,
    set,
    clearAfterSend,
  } = useSendStore();
  const tokens = useTokensStore((state) => state.tokens);
  const { smartWalletAddress, wallet, fetchBalances } = useUserStore(
    (state) => ({
      smartWalletAddress: state.smartWalletAddress,
      wallet: state.wallet,
      fetchBalances: state.fetchBalances,
    })
  );
  const colorScheme = useColorScheme();

  useLayoutEffect(() => navigation.setOptions({ headerShown: false }));

  useEffect(() => {
    if (!token) {
      const usdc = tokens?.find((token) => token.symbol === "USDC");
      if (usdc) update({ token: usdc });
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

  const handleInputChange = (event: string) => {
    if (!token || !token.balance) return;
    event = correctInput(event);

    if (
      Number(event) &&
      event.split(".")[1] &&
      event.split(".")[1].length > token.decimals
    ) {
      event = Number(event).toFixed(token.decimals);
    }

    if (
      Number(event) &&
      ethers.utils.parseUnits(event, token.decimals).gt(token.balance)
    ) {
      event = ethers.utils.formatUnits(token.balance, token.decimals);
    }

    if (Number(event) < 0) event = "0";

    update({
      amountIn: event,
    });
  };

  const max = () => {
    if (!token) return;
    update({
      amountIn: ethers.utils.formatUnits(token.balance ?? "0", token.decimals),
    });
  };

  useEffect(() => {
    if (debouncedAmountIn) updateQuote();
  }, [debouncedAmountIn, token, chainId, toAddress]);

  async function updateQuote() {
    if (!debouncedAmountIn || !token || !smartWalletAddress || !chainId) return;
    if (
      Number(debouncedAmountIn) * (token.priceUSD ?? 0) <
      SWAPAMOUNTIN_USD_THRESHOLD
    ) {
      console.log(
        `amountIn ${debouncedAmountIn} below $${SWAPAMOUNTIN_USD_THRESHOLD} so cannot quote`
      );
      return;
    }

    const formattedAmountIn = ethers.utils
      .parseUnits(debouncedAmountIn, token.decimals)
      .toString();

    update({ quote: null, calls: null, isSearching: true });

    try {
      const { data: response } = await axios.post(
        `${getURLInApp()}/api/quote/send`,
        {
          token: token,
          amountIn: formattedAmountIn,
          fromAddress: smartWalletAddress,
          toChainId: chainId,
          toAddress: toAddress ?? smartWalletAddress,
        }
      );
      update({
        quote: response.infos.quote as Quote,
        calls: response.calls,
        isSearching: false,
      });
    } catch (error: any) {
      console.log(error);
      update({ isSearching: false });
      const chainIdSuggested = error.response?.data?.chainId;
      if (chainIdSuggested) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: `No quote found. Please try with a higher amount or on ${
            getChain(chainIdSuggested).name
          }`,
        });
      }
    }
  }

  const successMessage = "🦄 Transfer successful!";
  const errorMessage =
    "🤯 Transfer failed. Please try again later or contact us.";

  const send = async () => {
    if (
      !toAddress ||
      toAddress.length !== 42 ||
      toAddress.slice(0, 2) !== "0x"
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid address",
      });
      return;
    }
    if (!calls || !wallet || !quote || !smartWalletAddress) return;
    const value = getRelayerValueToSend(quote);
    try {
      await relay(
        calls,
        wallet,
        smartWalletAddress,
        value,
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
    clearAfterSend();
    fetchBalances();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        <Text className="text-center text-5xl font-bold text-typo-light dark:text-typo-dark">
          Send
        </Text>

        <View className="mx-auto mt-4 mb-2 w-11/12 items-center rounded-xl bg-secondary-light py-6  dark:bg-secondary-dark">
          <View className="flex-row items-center">
            {token && tokens && (
              <View className="mx-4">
                <SelectTokenButton
                  tokens={tokens.filter(
                    (t) => ![token.symbol].includes(t.symbol)
                  )}
                  selectedToken={token}
                  tokenToUpdate={"Send"}
                />
              </View>
            )}
            {chainData && (
              <View className="mx-4">
                <SelectChainButton chainId={chainId} />
              </View>
            )}
          </View>
          <View className="mx-auto mt-6 w-2/3 rounded-xl border bg-primary-light p-2  dark:bg-primary-dark">
            <TextInput
              style={{
                color:
                  colorScheme === "light"
                    ? colors.typo.light
                    : colors.typo.dark,
              }}
              placeholderTextColor={colors.typo2.light}
              className="my-1 text-4xl font-semibold text-typo-light dark:text-typo-dark"
              onChangeText={handleInputChange}
              value={amountIn?.slice(0, 10) ?? ""}
              keyboardType="numeric"
              placeholder="0"
              textAlign="right"
            />
          </View>
          {token && (
            <View className="flex-row p-2">
              <Text className="pr-6 text-xs text-typo-light dark:text-typo-dark">
                Balance : {formatUnits(token.balance, token.decimals, 4)}{" "}
                {token.symbol}
              </Text>
              <TouchableHighlight onPress={max}>
                <View className="flex-row items-center">
                  <Image
                    className="mb-1 mr-0.5 h-3 w-3"
                    source={
                      colorScheme === "light"
                        ? require("../../assets/arrow_up.png")
                        : require("../../assets/arrow_up_white.png")
                    }
                  />
                  <Text className="font-bold text-typo-light dark:text-typo-dark">
                    Max
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          )}

          <View className="mx-auto my-4 w-2/3 rounded-xl border bg-primary-light p-2  dark:bg-primary-dark">
            <TextInput
              style={{
                color:
                  colorScheme === "light"
                    ? colors.typo.light
                    : colors.typo.dark,
              }}
              placeholderTextColor={colors.typo2.light}
              className="text-xs font-semibold text-typo-light dark:text-typo-dark"
              onChangeText={(value) => update({ toAddress: value })}
              value={toAddress ?? ""}
              placeholder="0x..."
            />
          </View>

          {token && quote && quote.sumOfToAmount && (
            <View>
              <Text className="mx-auto my-5 font-semibold text-typo-light dark:text-typo-dark">
                Amount received: {cutDecimals(quote.sumOfToAmount, 5)}{" "}
                {token.symbol}
              </Text>
              {Number(quote.sumOfToAmount) * 1.2 < Number(debouncedAmountIn) &&
                quote.singleQuotes[0]?.type === "lifi" && (
                  <Text className="mx-auto my-5 font-semibold text-typo-light dark:text-typo-dark">
                    For lower fees, try sending on{" "}
                    {getChainWithMaxBalance(token.chains).name}
                  </Text>
                )}
            </View>
          )}

          <View className="flex-row justify-evenly">
            {!debouncedAmountIn ||
            !toAddress ||
            !token ||
            isSearching ||
            Number(debouncedAmountIn) * (token?.priceUSD ?? 0) <
              SWAPAMOUNTIN_USD_THRESHOLD ||
            (token &&
              ethers.utils
                .parseUnits(debouncedAmountIn, token.decimals)
                .gt(token.balance ?? "0")) ? (
              <ActionButton
                text={
                  !debouncedAmountIn
                    ? "Enter amount"
                    : Number(debouncedAmountIn) * (token?.priceUSD ?? 0) <
                      SWAPAMOUNTIN_USD_THRESHOLD
                    ? "Amount too low"
                    : !toAddress
                    ? "Enter address"
                    : token &&
                      ethers.utils
                        .parseUnits(debouncedAmountIn, token.decimals)
                        .gt(token.balance ?? "0")
                    ? "Balance too low"
                    : isSearching
                    ? "Computing route..."
                    : "No route found."
                }
                disabled={true}
                action={() => {}}
              />
            ) : (
              <ActionButton text="Send" disabled={false} action={send} />
            )}
          </View>
        </View>
        <Toast />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SendScreen;
