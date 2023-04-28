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


const Settings = () => {
  const colorScheme = Appearance.getColorScheme();
  const [currency, setCurrency] = useSettingsStore((state) => [
    state.currency,
    state.setCurrency,
  ]);

  const pickerSelectStyles = StyleSheet.create({
    backgroundColor:
      colorScheme === "dark" ? colors.primary.dark : colors.secondary.light,
    color: colorScheme === "light" ? colors.typo.light : colors.typo.dark,
  });

  return (
    <SafeAreaView className="h-full bg-secondary-light dark:bg-primary-dark">
      <View className="mx-auto mt-4 w-11/12 items-center">
        <View className="w-full">
          <TouchableOpacity
            onPress={() => {
              // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // swiper.current.scrollBy(-1, true);
            }}
          >
            <Image
              className="h-6 w-6"
              source={
                colorScheme === "dark"
                  ? require("../../../assets/invest-drk.png")
                  : require("../../../assets/invest.png")
              }
            />
          </TouchableOpacity>
        </View>
        <Text className="text-2xl font-bold text-typo-light dark:text-typo-dark">
          Settings
        </Text>
        <Text className="mt-8 text-typo-light dark:text-typo-dark">
          Reference currency
        </Text>
        <View className="mt-2 w-full">
          <Picker
            selectedValue={currency}
            onValueChange={(value) => {
              console.log(value);
              setCurrency(value);
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
            <Picker.Item
              style={pickerSelectStyles}
              color={
                colorScheme === "light" ? colors.typo.light : colors.typo.dark
              }
              label="Euro"
              value="Euro"
            />
            <Picker.Item
              style={pickerSelectStyles}
              color={
                colorScheme === "light" ? colors.typo.light : colors.typo.dark
              }
              label="Dollar"
              value="Dollar"
            />
          </Picker>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
