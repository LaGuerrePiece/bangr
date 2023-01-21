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
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  ArrowLeftIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";
import { CallWithNonce, VaultData } from "../types/types";
import { formatUnits } from "../utils/format";
import ActionButton from "../components/ActionButton";
import { averageApy } from "../components/Vault";
import useTokensStore from "../state/tokens";
import useUserStore from "../state/user";
import useVaultsStore from "../state/vaults";
import { relay } from "../utils/signAndRelay";
import { correctInput, getURLInApp } from "../utils/utils";
import { Toast } from "react-native-toast-message/lib/src/Toast";

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
  const { name, description, color, protocol, chains, image } = params.vault;
  const apy = chains
    ? averageApy(chains.map((chain) => chain.apy)).toString()
    : "0";

  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState("USDC");
  const [items, setItems] = useState([{ label: "USDC", value: "USDC" }]);
  const [balance, setBalance] = useState("");
  const [deposited, setDeposited] = useState("");
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

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  });

  const getImage = (name: string) => {
    switch (name) {
      case "RocketPool":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/rpl.png")}
          />
        );
      case "Ethereum":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/ethereum.png")}
          />
        );
      case "GMX":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/glp.png")}
          />
        );
      case "Velodrome":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/velodrome.png")}
          />
        );
    }
  };

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
        "Deposit successfull",
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
        "Withdrawal successfull",
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
        <View className="mx-auto h-full w-11/12 rounded-lg p-3">
          <View className="flex">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "Vault" as never,
                  { name, description, apy, color, protocol } as never
                )
              }
            >
              {/*<Text className="text-md mb-3 text-right font-bold text-typo-light dark:text-typo-dark">
                HOW IT WORKS
              </Text>*/}
            </TouchableOpacity>
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
              {getImage(protocol)}
            </View>
          </View>
          <DropDownPicker
            style={{ backgroundColor: "#EFEEEC" }}
            open={open}
            value={selectedTokenSymbol}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedTokenSymbol}
            setItems={setItems}
          />
          <Text className="mt-2 text-right text-typo-light dark:text-typo-dark">
            Available:{" "}
            {balance ? formatUnits(balance, token?.decimals, 3) : "0"}{" "}
            {selectedTokenSymbol}
          </Text>
          <View className="mt-4 h-16 flex-row items-center justify-center rounded-lg bg-secondary-light dark:bg-secondary-dark">
            <TextInput
              className="w-4/5 text-4xl text-typo-light dark:text-typo-dark"
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

          <View className="mt-6 h-36 rounded-lg bg-secondary-light p-2 dark:bg-secondary-dark">
            <View className="flex-row items-center">
              <Text className="font-bold text-typo-light dark:text-typo-dark">
                Details:
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VaultDepositScreen;
