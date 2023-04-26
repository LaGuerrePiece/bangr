import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import useTokensStore from "../state/tokens";

const Yield = ({
  asset,
}: {
  asset: { symbol: string; yieldLow: string; yieldHigh: string };
}) => {
  const getToken = useTokensStore((state) => state.getToken);
  const colorScheme = useColorScheme();
  const navigation = useNavigation() as any;
  const { symbol, yieldLow, yieldHigh } = asset;

  const token = getToken(symbol);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ChooseVault", {
          asset,
        })
      }
    >
      <View className="my-2 rounded-xl border border-[#4F4F4F] bg-[#EFEEEC] dark:bg-secondary-dark">
        <View className="flex-row justify-between p-2">
          <View className="w-9/12 flex-row items-center">
            <Image
              className="h-10 w-10 rounded-full"
              source={{
                uri:
                  token?.logoURI ??
                  "https://static.debank.com/image/eth_token/logo_url/0x1a7e4e63778b4f12a199c062f3efdd288afcbce8/950fda44a9f4598d2a7a6e9df24b7332.png",
              }}
            />
            <Text className="ml-2 font-InterSemiBold text-[16px] font-bold text-typo-light dark:text-secondary-light">
              Earn from{" "}
              <Text className="text-green-600">
                {yieldLow}% to {yieldHigh}%
              </Text>{" "}
              annual yield on {symbol}
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
