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

const Settings = ({ swiper }: { swiper: any }) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const navigation = useNavigation();
  const [currency, setCurrency] = useCurrencyStore((state) => [
    state.currency,
    state.setCurrency,
  ]);
  return (
    <SafeAreaView className="h-full bg-secondary-light dark:bg-primary-dark">
      <View className="mx-auto mt-4 w-11/12 items-center">
        <View className="w-full">
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
        <Text className="text-2xl font-bold text-typo-light dark:text-typo-dark">
          Settings
        </Text>
        <Text className="mt-2 text-typo-light dark:text-typo-dark">
          Reference currency
        </Text>
        {/* <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        items={[
          { label: "Euro", value: "Euro" },
          { label: "Dollar", value: "Dollar" },
        ]}
        value={currency}
      /> */}
      </View>
    </SafeAreaView>
  );
};

export default Settings;
