import {
  View,
  Text,
  Image,
  useColorScheme,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import useUserStore from "../state/user";
import Toast from "react-native-toast-message";
import ActionButton from "../components/ActionButton";
import SelectTokenButton from "../components/SelectTokenButton";
import SelectChainButton from "../components/SelectChainButton";
import useTokensStore from "../state/tokens";
import useSendStore from "../state/send";
import { useEffect } from "react";
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
import { XMarkIcon } from "react-native-heroicons/outline";
import { toastConfig } from "../components/toasts";
import useTasksStore from "../state/tasks";
import Icon from "../components/Icon";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import {track} from "../utils/analytics";

const SendScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Send">) => {
  const {
    amountIn,
    debouncedAmountIn,
    tokenSymbol,
    chainId,
    toAddress,
    quote,
    calls,
    isSearching,
    gasFeeEstimateUSD,
    update,
    set,
    clearAfterSend,
  } = useSendStore();
  const { t } = useTranslation();
  const { tokens, getToken } = useTokensStore((state) => ({
    tokens: state.tokens,
    getToken: state.getToken,
  }));
  const fetchTasks = useTasksStore((state) => state.fetchTasks);
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

  const token = tokens?.find((token) => token.symbol === tokenSymbol);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (route.params?.updatedToken) {
      update({ token: route.params.updatedToken.symbol });
    }
  }, [route.params?.updatedToken]);

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
        `${getURLInApp()}/api/v1/quote/send`,
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
        gasFeeEstimateUSD: response.infos.gasFeeEstimateUSD,
        isSearching: false,
      });
    } catch (error: any) {
      console.log(error);
      update({ isSearching: false });
      const chainIdSuggested = error.response?.data?.chainId;
      if (chainIdSuggested) {
        Toast.show({
          type: "error",
          text1: t("error"),
          text2: t("noQuoteSend") + getChain(chainIdSuggested).name,
        });
        track("No quote found", smartWalletAddress);
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
        text1: t("error"),
        text2: t("invalidAddress"),
      });
      return;
    }
    if (!calls || !wallet || !quote || !smartWalletAddress) return;
    const value = getRelayerValueToSend(quote);
    const type = "send";
    const protocol = getChain(calls[0].cid).name;
    const asset1 = token?.symbol;
    const asset2 = toAddress;
    const amount = amountIn;

    try {
      relay(
        calls,
        wallet,
        smartWalletAddress,
        value,
        type,
        protocol,
        asset1!,
        asset2,
        amount!,
        successMessage,
        errorMessage
      );
      navigation.navigate("MainScreen", {
        screen: "History",
        params: { waitingForTask: true },
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: t("errorRelayingTransaction"),
      });
    }
    clearAfterSend();
    fetchBalances();
    repeatFetchTasks();
    navigation.navigate("MainScreen", {
      screen: "History",
      params: { waitingForTask: true },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="h-full bg-primary-light py-6 dark:bg-primary-dark">
        <TouchableWithoutFeedback onPress={navigation.goBack}>
          <View className="w-11/12 flex-row justify-end">
            <XMarkIcon
              size={36}
              color={
                colorScheme === "light" ? colors.typo.light : colors.typo.dark
              }
            />
          </View>
        </TouchableWithoutFeedback>
        <Text className="text-center font-InterBold text-3xl text-typo-light dark:text-typo-dark">
          {t("Send")}
        </Text>

        <View className="mx-auto w-11/12 items-center rounded-xl bg-primary-light py-6  dark:bg-primary-dark">
          <View className="flex-row items-center">
            {token && tokens && (
              <View className="mx-4">
                <SelectTokenButton
                  tokens={tokens.filter(
                    (t) => ![token.symbol].includes(t.symbol)
                  )}
                  selectedToken={token}
                />
              </View>
            )}
            {chainData && (
              <View className="mx-4">
                <SelectChainButton chainId={chainId} />
              </View>
            )}
          </View>
          <Text className="mt-6 w-11/12 text-lg font-bold text-typo-light dark:text-typo-dark">
            {t("Amount")}
          </Text>
          <View className="mt-2 h-16 w-11/12 flex-row items-center justify-center rounded-lg bg-secondary-light px-2 dark:bg-secondary-dark">
            <TextInput
              placeholderTextColor={colors.typo2.light}
              className="w-4/5 text-4xl font-semibold text-typo-light dark:text-typo-dark"
              onChangeText={handleInputChange}
              value={amountIn?.slice(0, 10) ?? ""}
              keyboardType="numeric"
              placeholder="0"
            />
            <TouchableOpacity onPress={max}>
              <View className="rounded-full bg-btn-light px-3 py-1 dark:bg-btn-dark">
                <Text className="text-secondary-light dark:text-secondary-dark">
                  MAX
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {token && (
            <View className="my-2 w-full flex-row justify-end pr-6">
              <Text className="text-sm text-typo-light dark:text-typo-dark">
                {t("Balance")} : {formatUnits(token.balance, token.decimals, 4)}{" "}
                {token.symbol}
              </Text>
            </View>
          )}

          <Text className="w-11/12 text-lg font-bold text-typo-light dark:text-typo-dark">
            Destination
          </Text>

          <View className="my-2 h-14 w-11/12 flex-row items-center justify-center rounded-lg bg-secondary-light px-2 dark:bg-secondary-dark">
            <TextInput
              placeholderTextColor={colors.typo2.light}
              className="w-full text-2xl font-semibold text-typo-light dark:text-typo-dark"
              onChangeText={(value) => update({ toAddress: value })}
              value={toAddress ?? ""}
              placeholder="0x..."
            />
          </View>

          {token && quote && quote.sumOfToAmount && (
            <View className="my-5">
              <Text className="mx-auto font-semibold text-typo-light dark:text-typo-dark">
                {t("Amount received")}: {cutDecimals(quote.sumOfToAmount, 5)}{" "}
                {token.symbol}
              </Text>
              {gasFeeEstimateUSD ? (
                <TouchableHighlight>
                  <View className="mx-auto mt-3 flex-row items-center">
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
              {Number(quote.sumOfToAmount) * 1.2 < Number(debouncedAmountIn) &&
                quote.singleQuotes[0]?.type === "lifi" && (
                  <Text className="mx-auto mt-2 text-center font-semibold text-typo-light dark:text-typo-dark">
                    Your funds will be bridged, which may take a few minutes{" "}
                    {"\n"}
                    For lower fees, try sending on{" "}
                    {getChainWithMaxBalance(token.chains).name}
                  </Text>
                )}
            </View>
          )}

          <View className="mt-4 flex-row justify-evenly">
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
                    ? t("Enter amount")
                    : Number(debouncedAmountIn) * (token?.priceUSD ?? 0) <
                      SWAPAMOUNTIN_USD_THRESHOLD
                    ? t("Amount too low")
                    : !toAddress
                    ? t("Enter address")
                    : token &&
                      ethers.utils
                        .parseUnits(debouncedAmountIn, token.decimals)
                        .gt(token.balance ?? "0")
                    ? t("Balance too low")
                    : isSearching
                    ? t("Computing route...")
                    : t("No route found")
                }
                disabled={true}
                rounded
                bold
                action={() => {}}
              />
            ) : (
              <ActionButton
                text="Send"
                styles={"min-w-[200px]"}
                rounded
                bold
                disabled={false}
                action={send}
              />
            )}
          </View>
        </View>
        <Toast config={toastConfig} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SendScreen;
