import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
  Appearance,
} from "react-native";
import { VaultData } from "../types/types";

const simple =
  Appearance.getColorScheme() === "dark"
    ? require("../../assets/simple_white.png")
    : require("../../assets/simple.png");

const complex =
  Appearance.getColorScheme() === "dark"
    ? require("../../assets/complex.png")
    : require("../../assets/complex.png");

export const getData = (name: string) => {
  switch (name) {
    case "Aave USDC":
      return {
        name: "Lending",
        contract: "Simple",
        tvl: "111M",
        image: "https://i.imgur.com/ZVEgeLH.png",
      };
    case "RocketPool":
      return {
        name: "Staking",
        contract: "Simple",
        tvl: "468M",
        image:
          "https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png",
      };
    default:
      return {
        name,
        contract: "Simple",
        tvl: "0",
      };
  }
};

export const averageApy = (apys: number[]) => {
  return (apys.reduce((acc, cur) => acc + cur, 0) / apys.length).toFixed(2);
};

export const FooterElement = ({
  title,
  image,
  text,
  textSize,
  marginLeft,
  styles,
}: {
  title: string;
  image?: any;
  text: string | undefined;
  textSize?: string;
  marginLeft?: number;
  styles?: string;
}) => {
  return (
    <View className={styles}>
      <Text className="font-InterMedium text-xs text-typo-light dark:text-typo-dark">
        {title}
      </Text>
      <View className="flex-row items-center">
        {image}
        <Text
          className={`font-InterSemiBold ${textSize} text-icon-special dark:text-secondary-light`}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

const Vault = ({ vault }: { vault: VaultData }) => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation() as any;
  const { name, description, currency, currencyIcon, volatility, image } =
    vault;

  const apy = vault.chains
    ? averageApy(vault.chains.map((chain) => chain.apy)).toString()
    : "0";

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("VaultDeposit", {
          vault,
        })
      }
    >
      <View className="my-3 rounded-3xl border border-[#4F4F4F] bg-[#EFEEEC] dark:bg-secondary-dark">
        <View className="mr-1 flex-row justify-between p-4">
          <View className="w-11/12">
            <Image
              className="h-12 w-12 rounded-full"
              source={{ uri: getData(name).image }}
            />
            <Text className="mt-2 mb-1 font-InterSemiBold text-[26px] font-bold text-typo-light dark:text-secondary-light">
              {getData(name).name}
            </Text>
            <Text className="text-[17px] text-typo-light dark:text-typo-dark">
              {description}
            </Text>
          </View>
        </View>
        <View className="rounded-b-3xl border-t border-[#4F4F4F] bg-[#DBDBDB] dark:bg-quaternary-dark">
          <View className="flex-row justify-between p-3">
            <View className="flex-row">
              <FooterElement
                title="Contract"
                text={getData(name).contract}
                styles="ml-2"
                image={
                  <Image
                    className={`mr-0.5 h-6 w-6 rounded-full object-contain`}
                    source={
                      getData(name).contract === "Simple" ? simple : complex
                    }
                  />
                }
                textSize={"text-base"}
              />
              <FooterElement
                title="Total Value"
                text={"$" + getData(name).tvl}
                styles="ml-4"
                textSize={"text-lg"}
              />
              <FooterElement
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
