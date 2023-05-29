import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButton from "../../components/ActionButton";
import { useTranslation } from "react-i18next";

export default function OrderConfirmed({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View>
        <View className="mt-2 p-8">
          <Text className="text-center font-InterBold text-2xl text-typo-light dark:text-typo-dark">
            {t("orderConfirmed")}
          </Text>
        </View>

        <Text className="mx-auto w-10/12 text-center text-lg text-typo-light dark:text-typo-dark">
          {t("orderShouldArriveSoon")}
        </Text>
      </View>

      <Image
        className="mx-auto h-80 w-80"
        source={require("../../../assets/figma/payment.png")}
      />

      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text={t("Back to wallet")}
          bold
          rounded
          action={() => navigation.navigate("MainScreen")}
        />
      </View>
    </SafeAreaView>
  );
}
