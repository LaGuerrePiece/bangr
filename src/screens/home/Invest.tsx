import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  useColorScheme,
  Linking,
} from "react-native";
import Vault from "../../components/Vault";
import useVaultsStore from "../../state/vaults";
import Yield from "../../components/Yield";

const Invest = ({ swiper }: { swiper: any }) => {
  const vaults = useVaultsStore((state) => state.vaults);
  const colorScheme = useColorScheme();

  const yieldAssets = [
    {
      symbol: "ETH",
      yieldLow: "5.06",
      yieldHigh: "9.36",
    },
    {
      symbol: "USDC",
      yieldLow: "1.22",
      yieldHigh: "12.59",
    },
  ];

  return (
    <SafeAreaView className="h-full bg-secondary-light dark:bg-primary-dark">
      <View className="mx-auto mt-4 w-11/12 items-center">
        <View className="w-full flex-row justify-between">
          <TouchableOpacity
            onPress={() => {
              swiper.current.scrollBy(-1, true);
            }}
          >
            <Image
              className="h-7 w-7"
              source={
                colorScheme === "dark"
                  ? require("../../../assets/pochicon-drk.png")
                  : require("../../../assets/pochicon.png")
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              swiper.current.scrollBy(1, true);
            }}
          >
            <Image
              className="h-7 w-7"
              source={
                colorScheme === "dark"
                  ? require("../../../assets/settings-drk.png")
                  : require("../../../assets/settings.png")
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View className="mx-auto w-[91%]">
          <Text className="mb-2 text-center font-InterBold text-3xl text-typo-light dark:text-typo-dark">
            Invest
          </Text>

          {yieldAssets.map((asset) => (
            <Yield key={asset.symbol} asset={asset} />
          ))}
        </View>
        <View className="my-16" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Invest;
