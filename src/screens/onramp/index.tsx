import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  ScrollView,
  useColorScheme,
} from "react-native";
import { ArrowLeftIcon, XMarkIcon } from "react-native-heroicons/outline";
import ActionButton from "../../components/ActionButton";
import useUserStore from "../../state/user";
import { correctInput } from "../../utils/utils";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { colors } from "../../config/configs";
import { Tab } from "../../components/Tab";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { useTranslation } from "react-i18next";
import SelectTokenButton from "../../components/SelectTokenButton";
import useTokensStore from "../../state/tokens";
import { MultichainToken } from "../../types/types";
import { track } from "../../utils/analytics";

const OnrampScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Onramp">) => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { scw } = useUserStore((state) => ({
    scw: state.smartWalletAddress,
  }));

  const { smartWalletAddress } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
  }));

  const tokens = useTokensStore((state) => state.tokens);

  const [amount, setAmount] = useState<string>("");
  const [tab, setTab] = useState<string>("card");
  const [tab2, setTab2] = useState<string>("USDC");

  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<string>("ETH");

  const selectedToken =
    tokens?.find(
      (token: MultichainToken) => token.symbol === selectedTokenSymbol
    ) ?? (tokens?.[0] as MultichainToken);

  useEffect(() => {
    if (route.params?.updatedToken) {
      setSelectedTokenSymbol(route.params.updatedToken.symbol);
    }
  }, [route.params?.updatedToken]);

  const next = async () => {
    if (!validateInput() || !smartWalletAddress) return;
    navigation.navigate("Transak", {
      fiatAmount: amount,
      cryptoCurrencyCode: tab2,
      paymentMethod: tab,
    });
    track("Onramp Clicked: ", scw);
  };

  const validateInput = () => {
    if (!parseFloat(amount) || parseFloat(amount) <= 0) {
      Toast.show({
        type: "error",
        text1: t("inputError") as string,
        text2: t("amountInvalid") as string,
      });
      return false;
    }
    return true;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="bg-primary-light dark:bg-primary-dark">
        <ScrollView className="h-full">
          <View onStartShouldSetResponder={() => true}>
            <View className="mx-auto w-11/12 p-3">
              <View className="">
                <TouchableWithoutFeedback onPress={navigation.goBack}>
                  <View className="flex-row justify-end">
                    <XMarkIcon
                      size={36}
                      color={
                        colorScheme === "light"
                          ? colors.typo.light
                          : colors.typo.dark
                      }
                    />
                  </View>
                </TouchableWithoutFeedback>
                <Text className="m-auto text-3xl font-bold text-typo-light dark:text-typo-dark">
                  {t("onrampScreenTitle")}
                </Text>
              </View>

              <View className="flex flex-col items-center">
                <Text className="mt-4 text-center text-xl font-semibold text-typo-light dark:text-typo-dark">
                  {t("Amount")}
                </Text>
                <View className="h-18 my-4 flex-row items-center rounded-xl px-2">
                  <TextInput
                    placeholderTextColor={colors.typo2.light}
                    className="h-20 text-center text-6xl font-semibold text-typo-light dark:text-typo-dark"
                    onChangeText={(e) => setAmount(correctInput(e))}
                    value={amount}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                  <Text className="mt-2 text-4xl font-semibold text-typo-light dark:text-typo-dark">
                    €
                  </Text>
                </View>
              </View>

              <View className="mx-auto my-3 flex-col">
                <Text className="text-center text-xl font-semibold text-typo-light dark:text-typo-dark">
                  {t("currency")}
                </Text>
                {/* <SelectTokenButton
                  tokens={tokens as MultichainToken[]}
                  selectedToken={selectedToken}
                  tokenToUpdate={"Onramp"}
                /> */}
                <View className="mt-6 flex-row items-center justify-around rounded-xl bg-quaternary-light py-0.5 px-3 dark:bg-quaternary-dark">
                  <View className="mx-3">
                    {/* <Image source={require("../../../assets/onramps/bank.png")} /> */}
                    <Tab
                      image={
                        // asset === "USDC"
                        require("../../../assets/usdc.png")
                      }
                      text={"USDC"}
                      action={() => setTab2("USDC")}
                      active={tab2 === "USDC"}
                    />
                  </View>
                  <View className="mx-3">
                    <Tab
                      image={require("../../../assets/ethereum.png")}
                      text={"ETH"}
                      action={() => setTab2("ETH")}
                      active={tab2 === "ETH"}
                    />
                  </View>
                </View>
              </View>

              <Text className="mt-4 text-center text-xl font-semibold text-typo-light dark:text-typo-dark">
                {t("paymentMethod")}
              </Text>
              <View className="mt-6 flex-row items-center justify-around rounded-xl bg-quaternary-light py-0.5 px-3 dark:bg-quaternary-dark">
                <View className="mx-3">
                  {/* <Image source={require("../../../assets/onramps/bank.png")} /> */}
                  <Tab
                    image={
                      colorScheme === "dark"
                        ? require("../../../assets/onramps/card_white.png")
                        : require("../../../assets/onramps/card.png")
                    }
                    text={t("card")}
                    action={() => setTab("card")}
                    active={tab === "card"}
                  />
                </View>
                <View className="mx-3">
                  <Tab
                    image={
                      colorScheme === "dark"
                        ? require("../../../assets/onramps/bank_white.png")
                        : require("../../../assets/onramps/bank.png")
                    }
                    text={t("transfer")}
                    action={() => setTab("transfer")}
                    active={tab === "transfer"}
                  />
                </View>
              </View>

              <View className="mt-8 mb-1">
                <ActionButton
                  text={t("Next")}
                  // styles={loading ? "opacity-50 rounded-xl" : "rounded-xl"}
                  styles={"rounded-xl"}
                  bold
                  action={next}
                />
              </View>

              {/* <HowItWorks
                action={() =>
                  navigation.navigate("VaultInfoSc
                  reen", {
                    investment: route.params.investment,
                    apy: apy,
                  })
                }
              /> */}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default OnrampScreen;
