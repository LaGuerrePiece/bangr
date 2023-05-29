import { Image, Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

export const Tab = (props: {
  text: string;
  action: any;
  active: boolean;
  image?: string | number;
}) => {
  const { text, action, active, image } = props;
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      onPress={async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), action();
      }}
    >
      {active ? (
        <View
          className={`mx-1 my-1 w-36 flex-row items-center justify-center rounded-xl bg-[#EFEEEC] py-1 dark:bg-secondary-dark`}
        >
          {image ? (
            <Image
              className="mr-1 h-7 w-7"
              source={typeof image === "string" ? { uri: image } : image}
            />
          ) : null}
          <Text
            className={`w-fit text-center text-base font-bold text-icon-special dark:text-secondary-light`}
          >
            {t(text)}
          </Text>
        </View>
      ) : (
        <View
          className={`mx-1 my-1 w-36 flex-row items-center justify-center rounded-xl py-1`}
        >
          {image ? (
            <Image
              className="mr-1 h-7 w-7"
              source={typeof image === "string" ? { uri: image } : image}
            />
          ) : null}
          <Text
            className={`w-fit text-center text-base font-bold text-icon-special dark:text-secondary-light`}
          >
            {t(text)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
