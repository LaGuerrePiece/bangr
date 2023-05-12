import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import useTokensStore from "../state/tokens";
import { VaultData, YieldAsset } from "../types/types";
import useVaultsStore from "../state/vaults";
import { averageApy } from "./Vault";
import * as amplitude from "@amplitude/analytics-react-native";

const Yield = ({ asset }: { asset: YieldAsset }) => {
  const getToken = useTokensStore((state) => state.getToken);
  const colorScheme = useColorScheme();
  const navigation = useNavigation() as any;
  const { symbol, yieldLow, yieldHigh, investments } = asset;

  const token = getToken(symbol);

  // displays apy of the first one for now
  const vault = useVaultsStore((state) => state.vaults)?.filter(
    (vault) => vault.name === investments[0].vaultName
  )[0] as VaultData;

  const apy = vault
    ? vault.chains
      ? averageApy(vault.chains.map((chain) => chain.apy)).toString()
      : "0"
    : "0";

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ChooseVault", {
          asset,
        });
        amplitude.track("Yield Clicked: " + symbol);
      }}
    >
      <View className="my-2 rounded-xl border border-[#4F4F4F] bg-[#EFEEEC] dark:bg-secondary-dark">
        <View className="flex-row justify-between p-2">
          <View className="w-9/12 flex-row items-center">
            <Image
              className="h-8 w-8 rounded-full"
              source={{
                uri:
                  token?.logoURI ??
                  "https://static.debank.com/image/eth_token/logo_url/0x1a7e4e63778b4f12a199c062f3efdd288afcbce8/950fda44a9f4598d2a7a6e9df24b7332.png",
              }}
            />
            {/* <Text className="ml-2 font-InterSemiBold text-[16px] font-bold text-typo-light dark:text-secondary-light">
              Earn from{" "}
              <Text className="text-green-600">
                {yieldLow}% to {yieldHigh}%
              </Text>{" "}
              annual yield on {symbol}
            </Text> */}
            <Text className="ml-2 font-InterSemiBold text-[16px] font-bold text-typo-light dark:text-secondary-light">
              Earn <Text className="text-green-600">{apy}%</Text> annually on{" "}
              {symbol}
            </Text>
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
    </TouchableOpacity>
  );
};

export default Yield;
