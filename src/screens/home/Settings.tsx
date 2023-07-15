import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Appearance,
  StyleSheet,
} from "react-native";

import { colors } from "../../config/configs";
import useSettingsStore from "../../state/settings";
import { Picker } from "@react-native-picker/picker";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

const Setting = ({
  title,
  value,
  setValue,
  options,
}: {
  title: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
}) => {
  const colorScheme = Appearance.getColorScheme();

  const [currency, setCurrency] = useSettingsStore((state) => [
    state.currency,
    state.setCurrency,
  ]);

  const handleCurrencyChange = async (value?: string) => {
    if (!value) setCurrency((await AsyncStorage.getItem("currency")) || "Euro");
    else
      try {
        await AsyncStorage.setItem("currency", value);
        setCurrency(value);
      } catch (e) {
        console.log(e);
      }
  };

  useEffect(() => {
    handleCurrencyChange();
  }, []);

  // Styles for the currency picker
  const pickerSelectStyles = StyleSheet.create({
    
    color: colorScheme === "light" ? colors.typo.light : colors.typo.dark,
  });

  return (
    <View className="mt-4 w-full ">
      <Text className="text-typo-light text-base dark:text-typo-dark">{title}</Text>
      <View className="w-full">
        <Picker
          selectedValue={value}
          onValueChange={(value) => {
            console.log(value);
            setValue(value);
          }}
          itemStyle={{
            backgroundColor:
              colorScheme === "dark"
                ? colors.primary.dark
                : colors.secondary.light,
          }}
          mode="dropdown"
          dropdownIconColor={
            colorScheme === "light" ? colors.typo.light : colors.typo.dark
          }
        >
          {options.map((option, i) => (
            <Picker.Item
              key={i}
              style={pickerSelectStyles}
              color={
                colorScheme === "light" ? colors.typo.light : colors.typo.dark
              }
              label={option}
              value={option}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const Settings = () => {
  const { t } = useTranslation();
  const [currency, setCurrency, language, setLanguage] = useSettingsStore(
    (state) => [
      state.currency,
      state.setCurrency,
      state.language,
      state.setLanguage,
    ]
  );

  return (
    <SafeAreaView className="h-full bg-secondary-light dark:bg-primary-dark">
      <View className="mx-auto mt-4 w-full items-center">
    
        <Text className="my-4  mb-8 font-InterBold text-3xl text-typo-light dark:text-typo-dark">
          {t("settings")}
        </Text>
        <View className="flex-row items-center justify-between bg-primary-light py-3 px-4 dark:bg-secondary-dark">
          <Setting
            title={t("currency")}
            value={currency}
            setValue={setCurrency}
            options={["Euro", "Dollar"]}
          />
        </View>
        <View className="flex-row items-center justify-between bg-secondary-light py-3 px-4 dark:bg-primary-dark">
          <Setting
            title={t("language")}
            value={language}
            setValue={(e) => {
              setLanguage(e);
              console.log("changed to", e);
              i18next.changeLanguage(e === "Français" ? "fr" : "en");
            }}
            options={["Français", "English"]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
