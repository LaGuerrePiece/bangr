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
import useYieldsStore from "../../state/yields";
import useVaultsStore from "../../state/vaults";

const Invest = () => {
  const vaults = useVaultsStore((state) => state.vaults);
  const colorScheme = useColorScheme();
  const yields = useYieldsStore((state) => state.yields);

  // console.log("yields", yields);

  return (
    <SafeAreaView className="h-full bg-secondary-light dark:bg-primary-dark">
      <View className="mx-auto mt-4 w-11/12 items-center">
        <View className="w-full flex-row justify-between">
          <TouchableOpacity
            onPress={() => {
              // swiper.current.scrollBy(-1, true);
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
              // swiper.current.scrollBy(1, true);
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

          {yields ? (
            yields.map((asset) => <Yield key={asset.symbol} asset={asset} />)
          ) : (
            <Text className="mb-2 mt-8 text-center font-Inter text-xl text-typo-light dark:text-typo-dark">
              No opportunities available
            </Text>
          )}
        </View>
        <View className="my-16" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Invest;
