import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { VaultData } from "../types/types";

export const averageApy = (apys: number[]) => {
  return (apys.reduce((acc, cur) => acc + cur, 0) / apys.length).toFixed(2);
};

const Vault = ({ vault }: { vault: VaultData }) => {
  const { name, description, color, protocol, chains, image } = vault;
  const apy = vault.chains
    ? averageApy(vault.chains.map((chain) => chain.apy)).toString()
    : "0";
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  return (
    <View className="m-auto mt-1 mb-3 w-full rounded-lg bg-secondary-light p-3 dark:bg-secondary-dark shadow-xl shadow-inner">
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            "VaultDeposit" as never,
            {
              vault,
            } as never
          )
        }
      >
        {/*<Image
          className="h-6 w-6"
          source={require("../../assets/ethereum.png")}
      />*/}
        <View className="flex-row justify-between">
          <View className="w-4/5">
            <Text className="text-xl font-bold text-typo-light dark:text-typo-dark">
              {name}
            </Text>
            <Text className="text-typo-light dark:text-typo-dark">
              {description}
            </Text>
          </View>
          <Image className="h-12 w-12" source={{ uri: image }} />
        </View>
        <View className="mt-2">
          <Text className="text-typo-light dark:text-typo-dark">
            Earn up to
          </Text>
          <View className="flex-row items-end justify-between">
            <Text className="mt-2 text-4xl font-bold" style={{ color }}>
              {apy}% <Text className="text-3xl">APY</Text>
            </Text>
            <Image
              className="h-[16px] w-[24px]"
              source={
                colorScheme === "light"
                  ? require("../../assets/arrowright.png")
                  : require("../../assets/arrowrightwhite.png")
              }
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Vault;
