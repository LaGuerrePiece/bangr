import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  useColorScheme,
} from "react-native";
import Yield from "../../components/Yield";
import { yieldAssets } from "../../config/yieldAssets";

const Invest = ({ swiper }: { swiper: any }) => {
  const colorScheme = useColorScheme();

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
