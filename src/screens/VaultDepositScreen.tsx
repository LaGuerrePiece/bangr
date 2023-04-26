import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import "@ethersproject/shims";
import { BigNumber, constants, ethers, utils } from "ethers";
import { useEffect, useState } from "react";
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
import { MultichainToken, VaultData } from "../types/types";
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
    updatedToken: MultichainToken | undefined;
  };
};

const VaultDepositScreen = ({
  route,
  navigation,
}: {
  route: RouteProp<VaultParams, "VaultDepositScreen">;
  navigation: any;
}) => {
  const colorScheme = useColorScheme();

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
  const { tokens, getToken } = useTokensStore((state) => ({
    tokens: state.tokens,
    getToken: state.getToken,
  }));

  const {
    name,
    image,
    longDescription,
    protocol,
    tokensIn,
    status,
    color,
    chains,
    vaultToken,
  } = vaults?.find((v) => v.name === route.params.vault.name)!;

  const apy = chains
    ? averageApy(chains.map((chain) => chain.apy)).toString()
    : "0";

  const defaultTokenSymbol = tokensIn[0];

  const [amount, setAmount] = useState("");
  const [selectedTokenSymbol, setSelectedTokenSymbol] =
    useState(defaultTokenSymbol);
  const [balance, setBalance] = useState("");
  const [deposited, setDeposited] = useState("0");

  const selectedToken = tokens?.find(
    (token) => token.symbol === selectedTokenSymbol
  );
  const vaultTkn = tokens?.find((token) => token.symbol === vaultToken);

  useEffect(() => {
    if (route.params?.updatedToken) {
      setSelectedTokenSymbol(route.params.updatedToken.symbol);
    }
  }, [route.params?.updatedToken]);

  const handleAmountChange = async (action: string) => {
    if (!parseFloat(amount)) {
      return;
    }

    // Input token is sent : USDC when we deposit and aUSDc when we withdraw
    const token = action === "deposit" ? selectedToken : vaultTkn;

    console.log(
      "token",
      token,
      "amount",
      amount,
      "action",
      action,
      "vaultName",
      name
    );

    try {
      const calls = await axios.post(`${getURLInApp()}/api/v1/quote/vault`, {
        address: smartWalletAddress,
        vaultName: name,
        action,
        amount: utils.parseUnits(amount, token!.decimals),
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

    if (wallet && smartWalletAddress) {
      try {
        relay(
          calls,
          wallet,
          smartWalletAddress,
          "0",
          "Invest",
          name,
          selectedTokenSymbol,
          "",
          amount,
          "Deposit successful",
          "Deposit failed"
        );
        navigation.navigate("History" as never, { waitingForTask: true } as never);
      } catch (error) {
        console.log(error);
        Toast.show({
          type: "error",
          text1: "error relaying transaction",
        });
      }
    }

    fetchBalances(smartWalletAddress);
    fetchVaults(smartWalletAddress);
  };

  const handleWithdraw = async () => {
    console.log("handleWithdraw");
    if (!validateInput("withdraw")) return;

    const calls = await handleAmountChange("withdraw");

    await relay(
      calls,
      wallet!,
      smartWalletAddress!,
      "0",
      "Withdraw",
      name,
      selectedTokenSymbol,
      "",
      amount,
      "Deposit successful",
      "Deposit failed"
    );

    fetchBalances(smartWalletAddress);
    fetchVaults(smartWalletAddress);
  };

  const validateInput = (action: string) => {
    try {
      utils.parseUnits(amount, selectedToken?.decimals);
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
        parseFloat(ethers.utils.formatUnits(balance, selectedToken?.decimals))
      ) {
        Toast.show({
          type: "error",
          text1: "Amount too high",
          text2: `${amount} exceeds your balance`,
        });
        return false;
      }
    } else {
      if (
        parseFloat(amount) >
        parseFloat(ethers.utils.formatUnits(deposited, vaultTkn?.decimals))
      ) {
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
    setBalance(
      tokens?.find((token) => token.symbol === selectedTokenSymbol)?.balance ||
        "0"
    );
    setDeposited(
      chains
        .map((chain) => chain.deposited)
        .reduce((acc, cur) => acc.add(cur), constants.Zero)
        .toString()
    );
  }, [selectedTokenSymbol, tokens, vaults]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="bg-primary-light dark:bg-primary-dark">
        <ScrollView className="h-full">
          <View onStartShouldSetResponder={() => true}>
            <View className="mx-auto w-11/12 p-3">
              <View className="mb-6 flex-row justify-between">
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={navigation.goBack}>
                    <ArrowLeftIcon size={24} color="#3A5A83" />
                  </TouchableOpacity>
                  <Text className="ml-3 text-2xl font-bold text-typo-light dark:text-typo-dark">
                    Deposit in {protocol}
                  </Text>
                </View>
                <Image
                  className="h-10 w-10 rounded-full"
                  source={{ uri: image }}
                />
              </View>

              <View className="my-2 items-center">
                {selectedToken && (
                  <SelectTokenButton
                    tokens={
                      tokensIn
                        .map((token) => getToken(token))
                        .filter((token) => {
                          return token !== undefined;
                        }) as MultichainToken[]
                    }
                    selectedToken={selectedToken}
                    paramsToPassBack={{
                      vault: route.params.vault,
                    }}
                  />
                )}
                <Text className="mt-2 text-typo-light dark:text-typo-dark">
                  Available:{" "}
                  {balance
                    ? formatUnits(balance, selectedToken?.decimals, 3)
                    : "0"}{" "}
                  {selectedTokenSymbol}
                </Text>
              </View>
              <View className="mt-4 h-16 flex-row items-center justify-center rounded-lg bg-secondary-light px-2 dark:bg-secondary-dark">
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
                        ? ethers.utils.formatUnits(
                            balance,
                            selectedToken?.decimals || 18
                          )
                        : "0"
                    );
                  }}
                >
                  <View className="rounded-full bg-btn-light px-3 py-1 dark:bg-btn-dark">
                    <Text className="text-secondary-light dark:text-secondary-dark">
                      MAX
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setAmount(
                    deposited
                      ? ethers.utils.formatUnits(
                          deposited,
                          selectedToken?.decimals || 18
                        )
                      : "0"
                  );
                }}
              >
                <Text className="mt-2 text-right text-typo-light dark:text-typo-dark">
                  Deposited:{" "}
                  {ethers.utils.formatUnits(deposited, selectedToken?.decimals)}{" "}
                  {selectedTokenSymbol}
                </Text>
              </TouchableOpacity>

              {status === "active" ? (
                <View className="mt-3 mb-6 flex-row justify-evenly">
                  {Number(deposited) > 0 ? (
                    <ActionButton
                      text="WITHDRAW"
                      rounded
                      bold
                      action={handleWithdraw}
                    />
                  ) : null}
                  <ActionButton
                    text=" DEPOSIT  "
                    additionalCss={Number(deposited) > 0 ? `` : `min-w-[200px]`}
                    rounded
                    bold
                    disabled={false}
                    action={handleDeposit}
                  />
                </View>
              ) : (
                <View className="my-6 flex-row justify-evenly">
                  <ActionButton
                    text="Coming soon™"
                    rounded
                    bold
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

              <View className="rounded-lg bg-secondary-light p-3 dark:bg-secondary-dark">
                <View className="flex-row items-center justify-center">
                  <Text className="font-bold text-typo-light dark:text-typo-dark">
                    Estimated returns based on current yield
                  </Text>
                  {/* <InformationCircleIcon color="#1C1C1C" /> */}
                </View>
                <View className="mt-2 flex-row justify-evenly">
                  <View>
                    <Text className="text-center text-typo-light dark:text-typo-dark">
                      Weekly
                    </Text>
                    <Text className="m-auto my-2 text-xl text-icon-special dark:text-secondary-light">
                      $
                      {amount
                        ? calculateGains(parseFloat(amount), parseFloat(apy), 7)
                        : 0}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-center text-typo-light dark:text-typo-dark">
                      Monthly
                    </Text>
                    <Text className="m-auto my-2 text-xl text-icon-special dark:text-secondary-light">
                      $
                      {amount
                        ? calculateGains(
                            parseFloat(amount),
                            parseFloat(apy),
                            30
                          )
                        : 0}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-center text-typo-light dark:text-typo-dark">
                      Annualy
                    </Text>
                    <Text className="m-auto my-2 text-xl text-icon-special dark:text-secondary-light">
                      $
                      {amount
                        ? calculateGains(
                            parseFloat(amount),
                            parseFloat(apy),
                            365
                          )
                        : 0}
                    </Text>
                  </View>
                </View>
              </View>

              {longDescription ? (
                <View className="mt-5">
                  <Text className="font-InterMedium text-xs text-typo-light dark:text-typo-dark">
                    Description
                  </Text>
                  <Text className="my-1 text-base leading-[22px] text-icon-special dark:text-secondary-light">
                    {longDescription}
                  </Text>
                </View>
              ) : null}

              <View className="m-auto my-6 w-full rounded-lg bg-secondary-light p-2 dark:bg-secondary-dark">
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("VaultInfoScreen", {
                      vault: route.params.vault,
                    })
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VaultDepositScreen;
