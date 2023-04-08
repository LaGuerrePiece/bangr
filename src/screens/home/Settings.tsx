import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Appearance,
  ActivityIndicator,
} from "react-native";

import { forceWalletEmpty } from "../../config/configs";
import ActionButton from "../../components/ActionButton";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import useCurrencyStore from "../../state/currency";
import * as SecureStore from "expo-secure-store";

const Settings = ({ swiper }: { swiper: any }) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const navigation = useNavigation();
  const [currency, setCurrency] = useCurrencyStore((state) => [
    state.currency,
    state.setCurrency,
  ]);

  // Only for testing, not for prod
  const disconnect = async () => {
    await SecureStore.deleteItemAsync("privKey");
  };

  return (
    <SafeAreaView className="mt-4 w-11/12 items-center">
      <View className="w-full flex-row ">
        <View className="mb-2 ml-2 w-full">
          <TouchableOpacity
            onPress={() => {
              // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              swiper.current.scrollBy(-1, true);
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
      </View>
      <Text className="text-2xl font-bold">Settings</Text>
      <Text className="mt-2">Reference currency</Text>
      {/* <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        items={[
          { label: "Euro", value: "Euro" },
          { label: "Dollar", value: "Dollar" },
        ]}
        value={currency}
      /> */}

      <TouchableOpacity onPress={disconnect}>
        <Text className="mt-4">Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;
