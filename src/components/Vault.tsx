import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
  Appearance,
} from "react-native";
import { Investment, VaultData } from "../types/types";
import useVaultsStore from "../state/vaults";
import { Information } from "./Information";

const simple =
  Appearance.getColorScheme() === "dark"
    ? require("../../assets/simple_white.png")
    : require("../../assets/simple.png");

const complex =
  Appearance.getColorScheme() === "dark"
    ? require("../../assets/layers_white.png")
    : require("../../assets/layers.png");

export const averageApy = (apys: number[]) => {
  return (apys.reduce((acc, cur) => acc + cur, 0) / apys.length).toFixed(2);
};

const Vault = ({ investment }: { investment: Investment }) => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation() as any;
  const {
    name: uiName,
    vaultName,
    contract,
    tvl: uiTvl,
    image: uiImage,
    description: uiDescription,
    disabled,
  } = investment;

  const vault = useVaultsStore((state) => state.vaults)?.filter(
    (vault) => vault.name === vaultName
  )[0] as VaultData;

  const {
    name,
    description,
    currency,
    currencyIcon,
    volatility,
    status,
    image,
    chains,
  } = vault;

  const apy = chains
    ? averageApy(chains.map((chain) => chain.apy)).toString()
    : "0";

  const tvl =
    (chains.reduce((acc, cur) => acc + cur.tvl, 0) / 10 ** 6 / 3).toFixed(2) +
    "M";

  return (
    <TouchableOpacity
      onPress={() => {
        if (disabled) return;
        navigation.navigate("VaultDeposit", {
          investment,
          vault,
        });
      }}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View
        className="my-3 rounded-3xl border border-[#4F4F4F] bg-[#EFEEEC] dark:bg-secondary-dark"
        style={disabled ? { opacity: 0.4 } : {}}
      >
        <View className="mr-1 flex-row justify-between p-4">
          <View className="w-11/12">
            <Image
              className="h-12	w-12 rounded-full"
              source={{ uri: uiImage ?? image }}
              resizeMode="contain"
            />
            <Text className="mt-2 mb-1 font-InterSemiBold text-[26px] font-bold text-typo-light dark:text-secondary-light">
              {uiName}
            </Text>
            <Text className="text-[17px] text-typo-light dark:text-typo-dark">
              {uiDescription ?? description}
            </Text>
          </View>
        </View>
        <View className="rounded-b-3xl border-t border-[#4F4F4F] bg-[#DBDBDB] dark:bg-quaternary-dark">
          <View className="flex-row justify-between p-3">
            <View className="flex-row">
              <Information
                title="Contract"
                text={contract}
                styles="ml-2"
                image={
                  <Image
                    className={`mr-0.5 h-6 w-6 rounded-full object-contain`}
                    source={contract === "Simple" ? simple : complex}
                  />
                }
                textSize={"text-base"}
              />
              <Information
                title="Total Value"
                text={"$" + (uiTvl ?? tvl)}
                styles="ml-4"
                textSize={"text-lg"}
              />
              <Information
                title="Annual yield"
                text={`${apy}%`}
                styles="ml-4"
                textSize={"text-xl"}
              />
            </View>
            <Image
              className="my-auto h-7 w-7"
              source={
                colorScheme === "dark"
                  ? require("../../assets/chevron_right_white.png")
                  : require("../../assets/chevron_right.png")
              }
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Vault;
