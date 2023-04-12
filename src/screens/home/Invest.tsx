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

          {vaults &&
            vaults
              .filter(
                (vault) =>
                  vault.status === "active" || vault.status === "preview"
              )
              .map((vault) => <Vault key={vault.name} vault={vault} />)}
          <View className="mb-8 w-full rounded-lg border border-[#4F4F4F] bg-[#EFEEEC] p-2 pr-3 dark:bg-secondary-dark">
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
        </View>
        <View className="my-16" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Invest;
