import {
  View,
  Text,
  Image,
  useColorScheme,
  TouchableOpacity,
  Share,
  TouchableWithoutFeedback,
} from "react-native";
import useUserStore from "../state/user";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Switch } from "react-native-gesture-handler";
import useConfigStore from "../state/config";
import { Picker } from "@react-native-picker/picker";

const SettingsScreen = () => {
  const colorScheme = useColorScheme();
  const configuration = useConfigStore();

  return (
    <View className="h-full items-center bg-primary-light py-6 dark:bg-primary-dark">
      {/* menu to toggle the dark mode */}
      {/* <View className="w-full flex-row items-center justify-between px-4">
        <Text className="text-2xl font-bold text-primary-dark dark:text-primary-light">
          Settings
        </Text>
        <Switch
          value={colorScheme === "dark"}
          onValueChange={() => {
            if (colorScheme === "dark") {
              configuration.setLightMode(true);
            } else {
              configuration.setLightMode(false);
            }
          }}
        />
        <View className="w-full flex-row items-center justify-between px-4">
          <Text className="text-2xl font-bold text-primary-dark dark:text-primary-light">
            Currency
          </Text>
          <Picker
            selectedValue={"USD"}
            onValueChange={(itemValue, itemIndex) => {
              configuration.setcuCurrency(itemValue);
            }}
          >
            <Picker.Item label="EUR" value="EUR" />
            <Picker.Item label="USD" value="USD" />
          </Picker>
        </View>
      </View> */}
    </View>
  );
};

export default SettingsScreen;
