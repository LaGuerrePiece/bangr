import { useTranslation } from "react-i18next";
import { Appearance, Image, Text, TouchableOpacity, View } from "react-native";

export const HowItWorks = (props: { action: any }) => {
  const {t} = useTranslation();
  return (
    <View className="m-auto my-6 w-full rounded-lg bg-secondary-light p-2 dark:bg-secondary-dark">
      <TouchableOpacity onPress={props.action}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              className="mr-2 ml-1 h-6 w-6"
              // className="h-[16px] w-[24px]"
              source={
                Appearance.getColorScheme() === "light"
                  ? require("../../assets/i3.png")
                  : require("../../assets/i.png")
              }
            />
            <Text className="text-xl font-bold text-typo-light dark:text-typo-dark">
              {t("howItWorks")}
            </Text>
          </View>
          <Image
            className="mr-1 h-[16px] w-[24px]"
            source={
              Appearance.getColorScheme() === "light"
                ? require("../../assets/arrowright.png")
                : require("../../assets/arrowrightwhite.png")
            }
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
