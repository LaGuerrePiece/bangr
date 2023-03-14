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
import { NavBar } from "../../components/NavBar";
import Vault from "../../components/Vault";
import useTabStore from "../../state/tab";
import useVaultsStore from "../../state/vaults";

const Invest = () => {
  const vaults = useVaultsStore((state) => state.vaults);
  const colorScheme = useColorScheme();
  // const { tab, setTab } = useTabStore();
  // setTab("Invest");

  return (
    <SafeAreaView className=" mx-auto mt-4 w-11/12">
      <View>
        <Text className="text-5xl font-bold text-typo-light dark:text-typo-dark">
          Invest
        </Text>
      </View>
      <View>
        <ScrollView>
          {vaults &&
            vaults
              .filter(
                (vault) =>
                  vault.status === "active" || vault.status === "preview"
              )
              .map((vault) => <Vault key={vault.name} vault={vault} />)}
          <View className="m-auto mt-1 mb-3 w-full rounded-lg bg-secondary-light p-2  dark:bg-secondary-dark">
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
        {/* <NavBar tab={tab} setTab={setTab} /> */}
      </View>
    </SafeAreaView>
  );
};

export default Invest;
