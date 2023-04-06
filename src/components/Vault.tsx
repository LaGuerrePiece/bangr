import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { VaultData, Volatility } from "../types/types";
import useTokensStore from "../state/tokens";

export const averageApy = (apys: number[]) => {
  return (apys.reduce((acc, cur) => acc + cur, 0) / apys.length).toFixed(2);
};

const Vault = ({ vault }: { vault: VaultData }) => {
  const {
    name,
    description,
    currency,
    currencyIcon,
    volatility,
    color,
    protocol,
    image,
  } = vault;
  const apy = vault.chains
    ? averageApy(vault.chains.map((chain) => chain.apy)).toString()
    : "0";
  const colorScheme = useColorScheme();
  const navigation = useNavigation() as any;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("VaultDeposit", {
          vault,
        })
      }
    >
      <View className="my-3 rounded-3xl bg-secondary-light dark:bg-secondary-dark">
        <View className="mr-1 flex-row justify-between p-4">
          <View className="w-11/12">
            <Image className="h-12 w-12 rounded-full" source={{ uri: image }} />
            <Text className="mt-2 mb-1 font-InterSemiBold text-[26px] font-bold text-icon-special dark:text-secondary-light">
              {name}
            </Text>
            <Text className="text-[17px] text-typo-light dark:text-typo-dark">
              {description}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("VaultInfoScreen", {
                vault,
              })
            }
            className="h-8 w-8"
          >
            <Image
              className="h-8 w-8 rounded-full"
              source={require("../../assets/i.png")}
            />
          </TouchableOpacity>
        </View>
        <View className="rounded-b-3xl bg-quaternary-light dark:bg-quaternary-dark">
          <View className="flex-row justify-between p-3">
            <View className="flex-row">
              <View className="ml-2">
                <Text className="font-InterMedium text-xs text-typo-light dark:text-typo-dark">
                  Currency
                </Text>
                <View className="flex-row items-center">
                  <Image
                    className={`mr-0.5 h-6 ${
                      currency === "Ether" ? "w-[16px]" : "w-6"
                    } rounded-full object-contain`}
                    source={{ uri: currencyIcon }}
                  />
                  <Text className="font-InterSemiBold text-[16px] text-icon-special dark:text-secondary-light">
                    {currency}
                  </Text>
                </View>
              </View>
              <View className="ml-5">
                <Text className="font-InterMedium text-xs text-typo-light dark:text-typo-dark">
                  Volatility
                </Text>
                <View className="flex-row items-center">
                  <Image
                    className="mr-0.5 h-7 w-7 rounded-full"
                    source={
                      volatility === Volatility.LOW
                        ? require("../../assets/turtle_white.png")
                        : volatility === Volatility.MEDIUM
                        ? require("../../assets/rabbit_white.png")
                        : require("../../assets/cheetah_white.png")
                    }
                  />
                  <Text className="font-InterSemiBold text-[16px] text-icon-special dark:text-secondary-light">
                    {volatility}
                  </Text>
                </View>
              </View>
              <View className="ml-5">
                <Text className="font-InterMedium text-xs text-typo-light dark:text-typo-dark">
                  Annual yield
                </Text>
                <View className="flex-row items-center">
                  <Text className="mt-1 font-InterSemiBold text-[18px] text-icon-special dark:text-secondary-light">
                    {apy}%
                  </Text>
                </View>
              </View>
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
        {/* <View className="mt-2">
          <Text className="text-typo-light dark:text-typo-dark">
            Earn up to
          </Text>
          <View className="flex-row items-end justify-between">
            <Text
              className="mt-2 text-4xl font-bold opacity-100"
              style={{ color }}
            >
              {apy}% <Text className="text-3xl opacity-100">APY</Text>
            </Text>
            {vault.status === "preview" ? (
              <Text className="font-bold text-typo-light dark:text-typo-dark">
                Coming soon™
              </Text>
            ) : (
              <Image
                className="h-[16px] w-[24px]"
                source={
                  colorScheme === "light"
                    ? require("../../assets/arrowright.png")
                    : require("../../assets/arrowrightwhite.png")
                }
              />
            )}
          </View>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

export default Vault;
