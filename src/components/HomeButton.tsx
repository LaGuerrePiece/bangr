import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { track } from "../utils/analytics";
import useUserStore from "../state/user";

const HomeButton = () => {
  const navigation = useNavigation() as any;
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const {scw} = useUserStore((state) => ({
    scw: state.smartWalletAddress,
  }));

  return (
    <View className="m-auto mt-4 flex w-11/12 flex-row justify-evenly">
      <TouchableOpacity
        className="w-1/3"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate("Receive", {});
        }}
      >
        <Image
          className="m-auto h-8 w-8"
          source={
            colorScheme === "light"
              ? require("../../assets/receive.png")
              : require("../../assets/receive-drk.png")
          }
        />
        <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
          {t("receive")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-1/3"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate("Onramp", {});
          track("Buy button clicked", scw);
        }}
      >
        <Image
          className="m-auto h-12 w-12"
          source={
            colorScheme === "light"
              ? require("../../assets/dollar.png")
              : require("../../assets/dollar-drk.png")
          }
        />
        <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
          {t("buy")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-1/3"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate("Send", {});
        }}
      >
        <Image
          className="m-auto h-8 w-8"
          source={
            colorScheme === "light"
              ? require("../../assets/send.png")
              : require("../../assets/send-drk.png")
          }
        />
        <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
          {t("send")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeButton;
