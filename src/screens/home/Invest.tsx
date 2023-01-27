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

const averageApy = (apys: number[]) => {
  return (apys.reduce((acc, cur) => acc + cur, 0) / apys.length).toFixed(2);
};

const Invest = () => {
  const vaults = useVaultsStore((state) => state.vaults);
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView className="top-20 mx-auto h-[90%] w-11/12">
      <View>
        <Text className="text-5xl font-bold text-typo-light dark:text-typo-dark">
          Invest
        </Text>
      </View>
      <View className="h-[90%]">
        <ScrollView>
          {vaults &&
            vaults
              .filter(
                (vault) =>
                  vault.status === "active" || vault.status === "preview"
              )
              .map((vault) => <Vault key={vault.name} vault={vault} />)}
          <View className="m-auto mt-1 mb-3 w-full rounded-lg bg-secondary-light p-2 shadow-sm dark:bg-secondary-dark">
            <TouchableOpacity
              onPress={() => Linking.openURL("https://tally.so/r/w2jYLb")}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    className="h-6 w-6"
                    // className="h-[16px] w-[24px]"
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Invest;
