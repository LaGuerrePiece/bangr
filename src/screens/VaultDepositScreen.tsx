import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import "@ethersproject/shims";
import { utils } from "ethers";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  ScrollView,
  useColorScheme,
} from "react-native";
import {
  ArrowLeftIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";
import { VaultData } from "../types/types";
import { formatUnits } from "../utils/format";
import ActionButton from "../components/ActionButton";
import { averageApy } from "../components/Vault";
import useTokensStore from "../state/tokens";
import useUserStore from "../state/user";
import useVaultsStore from "../state/vaults";
import { relay } from "../utils/signAndRelay";
import { correctInput, getURLInApp } from "../utils/utils";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import SelectTokenButton from "../components/SelectTokenButton";
import { colors } from "../config/configs";

const calculateGains = (
  amount: number,
  apy: number,
  period: number
): string => {
  return ((amount * (apy / 100)) / (365 / period)).toFixed(2);
};

type VaultParams = {
  VaultDepositScreen: {
    vault: VaultData;
  };
};

const VaultDepositScreen = () => {
  const { params } = useRoute<RouteProp<VaultParams, "VaultDepositScreen">>();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const { smartWalletAddress, wallet, fetchBalances } = useUserStore(
    (state) => ({
      smartWalletAddress: state.smartWalletAddress,
      wallet: state.wallet,
      fetchBalances: state.fetchBalances,
    })
  );
  const { fetchVaults, vaults } = useVaultsStore((state) => ({
    fetchVaults: state.fetchVaults,
    vaults: state.vaults,
  }));
  const tokens = useTokensStore((state) => state.tokens);
  const token = tokens?.find((token) => token.symbol === selectedTokenSymbol);

  const { name, image, description, protocol, status, color, chains } =
    params.vault;

  const apy = chains
    ? averageApy(chains.map((chain) => chain.apy)).toString()
    : "0";

  const defaultTokenSymbol = name === "Aave USDC" ? "USDC" : "ETH";

  const [amount, setAmount] = useState("");
  const [selectedTokenSymbol, setSelectedTokenSymbol] =
    useState(defaultTokenSymbol);
  const [balance, setBalance] = useState("");
  const [deposited, setDeposited] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  });

  const handleAmountChange = async (action?: string, tokenSymbol?: string) => {
    if (!parseFloat(amount)) {
      return;
    }
    const token = tokens?.find((token) =>
      token.symbol === tokenSymbol ? tokenSymbol : selectedTokenSymbol
    );

    try {
      const calls = await axios.post(`${getURLInApp()}/api/quote/vault`, {
        address: smartWalletAddress,
        vaultName: name,
        action: action ? action : "deposit",
        amount: utils.parseUnits(amount, token?.decimals),
        token,
      });

      return calls.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeposit = async () => {
    if (!validateInput("deposit")) return;

    const calls = await handleAmountChange("deposit");

    if (wallet && smartWalletAddress)
      await relay(
        calls,
        wallet,
        smartWalletAddress,
        "0",
        "Deposit successful",
        "Deposit failed"
      );

    fetchBalances(smartWalletAddress);
    fetchVaults(smartWalletAddress);
  };

  const handleWithdraw = async () => {
    if (!validateInput("withdraw")) return;

    const calls = await handleAmountChange("withdraw", "aUSDC");

    if (wallet && smartWalletAddress)
      await relay(
        calls,
        wallet,
        smartWalletAddress,
        "0",
        "Withdrawal successful",
        "Withdrawal failed"
      );

    fetchBalances(smartWalletAddress);
    fetchVaults(smartWalletAddress);
  };

  const validateInput = (action: string) => {
    try {
      utils.parseUnits(amount, token?.decimals);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Input error",
        text2: "Your amount is invalid",
      });
      return false;
    }

    if (!parseFloat(amount) || parseFloat(amount) <= 0) {
      Toast.show({
        type: "error",
        text1: "Input error",
        text2: "Your amount is invalid",
      });
      return false;
    }

    if (action === "deposit") {
      if (
        parseFloat(amount) >
        parseFloat(formatUnits(balance, token?.decimals, token?.decimals || 18))
      ) {
        Toast.show({
          type: "error",
          text1: "Amount too high",
          text2: `${amount} exceeds your balance`,
        });
        return false;
      }
    } else {
      if (parseFloat(amount) > parseFloat(deposited)) {
        Toast.show({
          type: "error",
          text1: "Amount too high",
          text2: `${amount} exceeds your deposited balance`,
        });
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    if (amount) handleAmountChange();
  }, [amount]);

  useEffect(() => {
    setBalance(
      tokens?.find((token) => token.symbol === selectedTokenSymbol)?.balance ||
        "0"
    );
    setDeposited(
      chains
        .map((chain) => chain.deposited)
        .reduce((acc, cur) => acc + cur, 0)
        .toString()
    );
  }, [selectedTokenSymbol, tokens, vaults]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="bg-primary-light dark:bg-primary-dark">
        <ScrollView className="h-full">
          <View
            onStartShouldSetResponder={() => true}
            className="mx-auto w-11/12 rounded-lg p-3"
          >
            <View className="flex">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    "Vault" as never,
                    {
                      name,
                      image,
                      description,
                      protocol,
                      status,
                      color,
                      apy,
                    } as never
                  )
                }
              ></TouchableOpacity>
              <View className="mb-6 flex-row justify-between">
                <View className="w-4/5">
                  <View className="flex-row items-center">
                    <TouchableOpacity onPress={navigation.goBack}>
                      <ArrowLeftIcon size={24} color="#3A5A83" />
                    </TouchableOpacity>
                    <Text className="ml-1 text-2xl font-bold text-typo-light dark:text-typo-dark">
                      Deposit in {name}
                    </Text>
                  </View>
                </View>
                <Image className="h-8 w-8" source={{ uri: image }} />
              </View>
            </View>

            <View className="my-2 flex items-center">
              {token && (
                <SelectTokenButton
                  tokens={[token]}
                  selectedToken={token}
                  tokenToUpdate={""}
                />
              )}
              <Text className="mt-2 text-right text-typo-light dark:text-typo-dark">
                Available:{" "}
                {balance ? formatUnits(balance, token?.decimals, 3) : "0"}{" "}
                {selectedTokenSymbol}
              </Text>
            </View>
            <View className="mt-4 h-16 flex-row items-center justify-center rounded-lg bg-secondary-light dark:bg-secondary-dark">
              <TextInput
                placeholderTextColor={colors.typo2.light}
                className="w-4/5 text-4xl font-semibold text-typo-light dark:text-typo-dark"
                onChangeText={(e) => setAmount(correctInput(e))}
                value={amount}
                keyboardType="numeric"
                placeholder="0"
              />
              <TouchableOpacity
                onPress={() => {
                  setAmount(
                    balance
                      ? formatUnits(
                          balance,
                          token?.decimals,
                          token?.decimals || 18
                        )
                      : "0"
                  );
                }}
              >
                <View className="rounded-xl bg-btn-light px-3 py-1 dark:bg-btn-dark">
                  <Text className="text-secondary-light dark:text-secondary-dark">
                    MAX
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text className="mt-2 text-right text-typo-light dark:text-typo-dark">
              Deposited: {deposited} {selectedTokenSymbol}
            </Text>

            {status === "active" ? (
              <View className="mt-12 flex-row justify-evenly">
                <ActionButton
                  text="WITHDRAW"
                  disabled={
                    chains
                      .map((chain) => chain.deposited)
                      .reduce((acc, cur) => acc + cur, 0) > 0
                      ? false
                      : true
                  }
                  action={handleWithdraw}
                />
                <ActionButton
                  text="DEPOSIT"
                  disabled={false}
                  action={handleDeposit}
                />
              </View>
            ) : (
              <View className="mt-12 flex-row justify-evenly">
                <ActionButton
                  text="COMING"
                  disabled={true}
                  action={() => {
                    Toast.show({
                      type: "info",
                      text1: "Coming soon !",
                    });
                  }}
                />
                <ActionButton
                  text="SOON™"
                  disabled={true}
                  action={() => {
                    Toast.show({
                      type: "info",
                      text1: "Coming soon !",
                    });
                  }}
                />
              </View>
            )}

            <View className="mt-6 h-36 rounded-lg bg-secondary-light p-2 dark:bg-secondary-dark">
              <View className="flex-row items-center">
                <Text className="font-bold text-typo-light dark:text-typo-dark">
                  Estimated returns based on current APY
                </Text>
                <InformationCircleIcon color="#1C1C1C" />
              </View>
              <View className="mt-3 flex-row justify-evenly">
                <View className="h-[85%]">
                  <Text className="text-typo-light dark:text-typo-dark">
                    Weekly
                  </Text>
                  <Text className="m-auto text-center text-xl text-typo-light dark:text-typo-dark">
                    $
                    {amount
                      ? calculateGains(parseFloat(amount), parseFloat(apy), 7)
                      : 0}
                  </Text>
                </View>
                <View className="h-[85%]">
                  <Text className="text-typo-light dark:text-typo-dark">
                    Monthly
                  </Text>
                  <Text className="m-auto text-center text-xl text-typo-light dark:text-typo-dark">
                    $
                    {amount
                      ? calculateGains(parseFloat(amount), parseFloat(apy), 30)
                      : 0}
                  </Text>
                </View>
                <View className="h-[85%]">
                  <Text className="text-typo-light dark:text-typo-dark">
                    Annualy
                  </Text>
                  <Text className="m-auto text-center text-xl text-typo-light dark:text-typo-dark">
                    $
                    {amount
                      ? calculateGains(parseFloat(amount), parseFloat(apy), 365)
                      : 0}
                  </Text>
                </View>
              </View>
            </View>

            {/* <View className="mt-2 h-24 rounded-lg bg-secondary-light p-2 dark:bg-secondary-dark">
              <View className="flex-row items-center">
                <Text className="font-bold text-typo-light dark:text-typo-dark">
                  Details:
                </Text>
              </View>
            </View> */}
            <View className="m-auto mt-6 mb-3 w-full rounded-lg bg-secondary-light p-2  dark:bg-secondary-dark">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    "VaultInfoScreen" as never,
                    { vault: params.vault } as never
                  )
                }
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Image
                      className="mr-2 ml-1 h-6 w-6"
                      // className="h-[16px] w-[24px]"
                      source={
                        colorScheme === "light"
                          ? require("../../assets/question.png")
                          : require("../../assets/question.png")
                      }
                    />
                    <Text className="text-xl font-bold text-typo-light dark:text-typo-dark">
                      How it works
                    </Text>
                  </View>
                  <Image
                    className="mr-1 h-[16px] w-[24px]"
                    source={
                      colorScheme === "light"
                        ? require("../../assets/arrowright.png")
                        : require("../../assets/arrowrightwhite.png")
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VaultDepositScreen;
