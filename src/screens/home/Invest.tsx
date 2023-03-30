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
import * as Haptics from "expo-haptics";

const Invest = ({ swiper }: { swiper: any }) => {
  const vaults = useVaultsStore((state) => state.vaults);
  const colorScheme = useColorScheme();
  // const { tab, setTab } = useTabStore();
  // setTab("Invest");

  return (
    <SafeAreaView className="mt-4 w-11/12">
      <View className="w-full flex-row ">
        <View className="mb-2 w-1/2">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              swiper.current.scrollBy(-1, true);
            }}
          >
            <Image
              className="mr-auto h-6 w-6"
              source={
                colorScheme === "dark"
                  ? require("../../../assets/pochicon-drk.png")
                  : require("../../../assets/pochicon.png")
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="">
        <ScrollView className="">
          <View>
            <Text className="text-center text-5xl font-bold text-typo-light dark:text-typo-dark">
              Invest
            </Text>
          </View>

          {vaults &&
            vaults
              .filter(
                (vault) =>
                  vault.status === "active" || vault.status === "preview"
              )
              .map((vault) => <Vault key={vault.name} vault={vault} />)}
          <View className="mb-8 w-full rounded-lg bg-secondary-light p-2 pr-3 dark:bg-secondary-dark">
            <TouchableOpacity
              onPress={() => Linking.openURL("https://tally.so/r/w2jYLb")}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    className="h-6 w-6"
                    source={
                      colorScheme === "light"
                        ? require("../../../assets/idea.png")
                        : require("../../../assets/idea_white.png")
                    }
                  />
                  <Text className="text-xl font-bold text-typo-light dark:text-typo-dark">
                    Suggest a vault
                  </Text>
                </View>
                <Image
                  className="h-[16px] w-[24px]"
                  source={
                    colorScheme === "light"
                      ? require("../../../assets/arrowright.png")
                      : require("../../../assets/arrowrightwhite.png")
                  }
                />
              </View>
            </TouchableOpacity>
          </View>
          <View className="my-16" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Invest;
