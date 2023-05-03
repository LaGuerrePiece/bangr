import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import "@ethersproject/shims";
import { constants, ethers, utils } from "ethers";
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
import { Investment, MultichainToken, VaultData } from "../types/types";
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
import { Tab } from "../components/Tab";
import { Protocol } from "../components/Protocol";
import { HowItWorks } from "../components/HowItWorks";
import { Information } from "../components/Information";
import useTasksStore from "../state/tasks";

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
    investment: Investment;
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
  const { fetchVaults, vaults } = useVaultsStore((state) => ({
    fetchVaults: state.fetchVaults,
    vaults: state.vaults,
  }));
  const { tokens, getToken } = useTokensStore((state) => ({
    tokens: state.tokens,
    getToken: state.getToken,
  }));

    const {
      name: uiName,
      vaultName,
      longDescription: uiLongDescription,
      contract,
      tvl: uiTvl,
      image: uiImage,
      protocols,
      risks,
    } = {
      ... route.params.investment,
    };
    
    
  

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

  const tvl =
    (chains.reduce((acc, cur) => acc + cur.tvl, 0) / 10 ** 6 / 3).toFixed(2) +
    "M";

  const defaultTokenSymbol = tokensIn[0];

  const [amount, setAmount] = useState("");
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(tokensIn[0]);
  const [balance, setBalance] = useState("");
  const [deposited, setDeposited] = useState("0");
  const [tab, setTab] = useState("Deposit");

  const selectedToken = tokens?.find(
    (token) => token.symbol === selectedTokenSymbol
  );
  const vaultTkn = tokens?.find((token) => token.symbol === vaultToken);

  const handleAmountChange = async (action: string) => {
    if (!parseFloat(amount)) {
      return;
    }

    // Input token is sent : USDC when we deposit and aUSDc when we withdraw
    const token = action === "deposit" ? selectedToken : vaultTkn;

    console.log("token", token);
    console.log("amount", amount);
    console.log("action", action);
    console.log("vaultName", name);

    try {
      const calls = await axios.post(`${getURLInApp()}/api/v1/quote/vault`, {
        address: smartWalletAddress,
        vaultName: name,
        action,
        amount: utils.parseUnits(amount, token!.decimals),
        token,
      });

      if (calls.data.length === 0) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error fetching quote",
        });
        console.log("error fetching quote");
        return;
      }

      return calls.data;
    } catch (err) {
      console.log("err in VaultDepositScreen", err);
    }
  };

  const handleDeposit = async () => {
    if (!validateInput("deposit")) return;

    const calls = await handleAmountChange("deposit");

    if (wallet && smartWalletAddress && calls) {
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
        navigation.navigate(
          "History" as never,
          { waitingForTask: true } as never
        );
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
    repeatFetchTasks();
    navigation.navigate("History" as never, { waitingForTask: true } as never);
  };

  const handleWithdraw = async () => {
    console.log("handleWithdraw");
    if (!validateInput("withdraw")) return;

    const calls = await handleAmountChange("withdraw");

    // console.log("calls", calls);

    if (wallet && smartWalletAddress && calls) {
      try {
        await relay(
          calls,
          wallet,
          smartWalletAddress,
          "0",
          "Withdraw",
          name,
          selectedTokenSymbol,
          "",
          amount,
          "Withdraw successful",
          "Withdraw failed"
        );
      } catch (error) {
        console.log("error relaying:", error);
        Toast.show({
          type: "error",
          text1: "error relaying transaction",
        });
      }
    }

    fetchBalances(smartWalletAddress);
    fetchVaults(smartWalletAddress);
    repeatFetchTasks();
    navigation.navigate("History" as never, { waitingForTask: true } as never);
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

  const switchTab = (tab: string) => {
    setAmount("");
    setTab(tab);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="bg-primary-light dark:bg-primary-dark">
        <ScrollView className="h-full">
          <View onStartShouldSetResponder={() => true}>
            <View className="mx-auto w-11/12 p-3">
              <View className="mb-2 flex-row justify-between">
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={navigation.goBack}>
                    <ArrowLeftIcon size={24} color="#3A5A83" />
                  </TouchableOpacity>
                  {/* <Text className="ml-3 text-2xl font-bold text-typo-light dark:text-typo-dark">
                    {uiName}
                  </Text> */}
                </View>
                {/* <Image
                  className="h-10 w-10 rounded-full"
                  source={{ uri: uiImage ?? image }}
                /> */}
              </View>

              <View className="my-2 rounded-3xl border border-[#4F4F4F] bg-[#EFEEEC] p-3 dark:bg-secondary-dark">
                <View className="mb-2 flex-row items-center">
                  <Image
                    className="h-8 w-8 rounded-full"
                    source={{ uri: uiImage ?? image }}
                    resizeMode="contain"
                  />
                  <Text className="ml-2 font-InterSemiBold text-[26px] font-bold text-typo-light dark:text-secondary-light">
                    {uiName}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Information
                    title="Your assets"
                    text={`${formatUnits(
                      deposited,
                      selectedToken?.decimals,
                      5
                    )} ${selectedTokenSymbol}`}
                    textSize={"text-lg"}
                  />
                  <Information
                    styles="mr-4"
                    title="Earnings"
                    text={"soon™"}
                    textSize={"text-lg"}
                  />
                </View>
                <View className="my-2 border border-[#4F4F4F]" />
                <View className="flex-row justify-between">
                  <Information
                    title="Annual yield"
                    text={`${apy}%`}
                    textSize={"text-lg"}
                  />
                  <Information
                    styles="mr-4"
                    title="Total vault value"
                    text={"$" + (tvl ?? tvl)}
                    textSize={"text-lg"}
                  />
                </View>

                {/* Input asset is now selected before that. But might reuse this for multi-asset vaults like glp */}
                {/* <View className="my-2 items-center">
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
                  <Text className="mt-3 text-typo-light dark:text-typo-dark">
                    Available:{" "}
                    {balance
                      ? formatUnits(balance, selectedToken?.decimals, 3)
                      : "0"}{" "}
                    {selectedTokenSymbol}
                  </Text>
                </View> */}

                {tokensIn.length > 1 ? (
                  <View className="mt-3 px-3 flex-row items-center justify-around rounded-xl bg-quaternary-light dark:bg-quaternary-dark">
                    <View className="mx-3 ">
                    <Tab
                      image={getToken(tokensIn[0])?.logoURI}
                      text={tokensIn[0]}
                      action={() => setSelectedTokenSymbol(tokensIn[0])}
                      active={selectedTokenSymbol === tokensIn[0]}
                    />
                    </View>
                    <View className="mx-3">
                    <Tab
                      image={getToken(tokensIn[1])?.logoURI}
                      text={tokensIn[1]}
                      action={() => setSelectedTokenSymbol(tokensIn[1])}
                      active={selectedTokenSymbol === tokensIn[1]}
                    />
                    </View>
                  </View>
                ) : null}

                <View className="my-3 px-3 flex-row items-center justify-around rounded-xl bg-quaternary-light dark:bg-quaternary-dark">
                  <View className="mx-3 ">
                  <Tab
                    text="Deposit"
                    action={() => switchTab("Deposit")}
                    active={tab === "Deposit"}
                  />
                  </View>
                  <View className="mx-3">
                  <Tab
                    text="Withdraw"
                    action={() => switchTab("Withdraw")}
                    active={tab === "Withdraw"}
                  />
                  </View>
                </View>

                <View className="mt-2 flex-row justify-between">
                  <Text className="text-typo-light dark:text-typo-dark">
                    {tab}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (tab === "Deposit") {
                        setAmount(
                          balance
                            ? ethers.utils.formatUnits(
                                balance,
                                selectedToken?.decimals || 18
                              )
                            : "0"
                        );
                      } else {
                        setAmount(
                          deposited
                            ? ethers.utils.formatUnits(
                                deposited,
                                selectedToken?.decimals || 18
                              )
                            : "0"
                        );
                      }
                    }}
                  >
                    <Text className="text-typo-light dark:text-typo-dark">
                      Use max (
                      {tab === "Deposit"
                        ? formatUnits(balance, selectedToken?.decimals, 3)
                        : formatUnits(
                            deposited,
                            selectedToken?.decimals,
                            3
                          )}{" "}
                      {selectedTokenSymbol})
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="my-1 h-14 flex-row items-center justify-center rounded-xl bg-quaternary-light px-2 dark:bg-quaternary-dark">
                  <TextInput
                    placeholderTextColor={colors.typo2.light}
                    className="w-4/5 text-3xl font-semibold text-typo-light dark:text-typo-dark"
                    onChangeText={(e) => setAmount(correctInput(e))}
                    value={amount}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (tab === "Deposit") {
                        setAmount(
                          balance
                            ? ethers.utils.formatUnits(
                                balance,
                                selectedToken?.decimals || 18
                              )
                            : "0"
                        );
                      } else {
                        setAmount(
                          deposited
                            ? ethers.utils.formatUnits(
                                deposited,
                                selectedToken?.decimals || 18
                              )
                            : "0"
                        );
                      }
                    }}
                  >
                    <View className="rounded-full bg-btn-light px-3 py-1 dark:bg-btn-dark">
                      <Text className="text-secondary-light dark:text-secondary-dark">
                        MAX
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View className="mt-4 mb-1">
                  <ActionButton
                    text={tab}
                    styles={`rounded-xl`}
                    bold
                    action={tab === "Deposit" ? handleDeposit : handleWithdraw}
                  />
                </View>
              </View>

              <View className="mt-3">
                <Text className="font-InterBold text-lg text-icon-special dark:text-secondary-light">
                  Description
                </Text>
                <Text className="my-1 text-base leading-[22px] text-typo-light dark:text-typo-dark ">
                  {uiLongDescription ?? longDescription}
                </Text>
              </View>

              <View className="mt-3">
                <Text className="font-InterBold text-lg text-icon-special dark:text-secondary-light">
                  Utilized Protocols
                </Text>
                <View className="flex-wrap">
                  {protocols && protocols?.length > 0
                    ? protocols?.map((protocol) => {
                        return (
                          <Protocol
                            key={protocol.name}
                            name={protocol.name}
                            image={protocol.icon}
                            link={protocol.link}
                          />
                        );
                      })
                    : null}
                </View>
              </View>

              <View className="mt-3">
                <Text className="font-InterBold text-lg text-icon-special dark:text-secondary-light">
                  Risks
                </Text>
                <Text className="my-1 text-base leading-[22px] text-typo-light dark:text-typo-dark ">
                  {risks}
                </Text>
              </View>

              <HowItWorks
                action={() =>
                  navigation.navigate("VaultInfoScreen", {
                    investment: route.params.investment,
                    apy: apy,
                  })
                }
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VaultDepositScreen;
