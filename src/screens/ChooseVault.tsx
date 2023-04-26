import { RouteProp } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  useColorScheme,
  Linking,
} from "react-native";
import useVaultsStore from "../state/vaults";
import Vault from "../components/Vault";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import useTokensStore from "../state/tokens";
import { YieldAsset } from "../config/yieldAssets";

type ChooseVaultParams = {
  ChooseVaultScreen: {
    asset: YieldAsset;
  };
};

const ChooseVaultScreen = ({
  route,
  navigation,
}: {
  route: RouteProp<ChooseVaultParams, "ChooseVaultScreen">;
  navigation: any;
}) => {
  const colorScheme = useColorScheme();
  const { asset } = route.params;
  const getToken = useTokensStore((state) => state.getToken);
  const token = getToken(asset.symbol);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="bg-primary-light dark:bg-primary-dark">
        <ScrollView className="h-full">
          <View className="mx-auto w-11/12">
            <View className="mb-6 flex-row justify-between">
              <View className="flex-row items-center">
                <TouchableOpacity onPress={navigation.goBack}>
                  <ArrowLeftIcon size={24} color="#3A5A83" />
                </TouchableOpacity>
                <Text className="ml-3 font-InterBold text-xl text-typo-light dark:text-typo-dark">
                  Choose a vault
                </Text>
              </View>
              <Image
                className="h-10 w-10 rounded-full"
                source={{ uri: token?.logoURI }}
              />
            </View>

            {asset.investments.map((investment) => (
              <Vault key={investment.name} investment={investment} />
            ))}

            <View className="mb-8 mt-2 w-full rounded-lg border border-[#4F4F4F] bg-[#EFEEEC] p-2 pr-3 dark:bg-secondary-dark">
              <TouchableOpacity
                onPress={() => Linking.openURL("https://tally.so/r/w2jYLb")}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Image
                      className="h-6 w-6"
                      source={
                        colorScheme === "light"
                          ? require("../../assets/idea.png")
                          : require("../../assets/idea_white.png")
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
                        ? require("../../assets/arrowright.png")
                        : require("../../assets/arrowrightwhite.png")
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ChooseVaultScreen;
