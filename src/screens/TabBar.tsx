import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useColorScheme,
} from "react-native";

export const getLanguage = () => {
  return (
    i18n.language ||
    (typeof window !== "undefined" && window.localStorage.i18nextLng) ||
    "en"
  );
};

export function TabBar({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <View className="flex flex-row bg-primary-light p-4 dark:bg-secondary-dark">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true } as any);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
            key={index}
          >
            <View className="w-full flex-col justify-between">
              <Image
                className={
                  isFocused ? "m-auto h-7 w-7" : "m-auto h-7 w-7 opacity-50"
                }
                source={
                  label === "Invest" && colorScheme === "dark"
                    ? require("../../assets/seed-drk.png")
                    : label === "Invest" && colorScheme === "light"
                    ? require("../../assets/seed.png")
                    : label === "Settings" && colorScheme === "dark"
                    ? require("../../assets/settings-drk.png")
                    : label === "Settings" && colorScheme === "light"
                    ? require("../../assets/settings.png")
                    : label === "Wallet" && colorScheme === "dark"
                    ? require("../../assets/wallet-drk.png")
                    : label === "Wallet" && colorScheme === "light"
                    ? require("../../assets/wallet.png")
                    : label === "Swap" && colorScheme === "dark"
                    ? require("../../assets/swap-drk.png")
                    : label === "Swap" && colorScheme === "light"
                    ? require("../../assets/swap.png")
                    : label === "History" && colorScheme === "dark"
                    ? require("../../assets/history-drk.png")
                    : label === "History" && colorScheme === "light"
                    ? require("../../assets/history.png")
                    : label === "Home" && colorScheme === "dark"
                }
              />
              {getLanguage().substring(0, 2) == "fr" ? (
                <Text
                  className={
                    isFocused
                      ? "text-center font-Inter text-xs text-typo-light dark:text-typo-dark"
                      : "text-center font-Inter text-xs text-typo-light opacity-50 dark:text-typo-dark"
                  }
                >
                  {t(label) as string}
                </Text>
              ) : (
                <Text
                  className={
                    isFocused
                      ? "text-center font-InterBold text-typo-light dark:text-typo-dark"
                      : "text-center font-InterBold text-typo-light opacity-50 dark:text-typo-dark"
                  }
                >
                  {t(label) as string}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
