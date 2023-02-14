import "react-native-get-random-values";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { colors } from "../config/configs";
import { WebView } from "react-native-webview";

const OnrampScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get("window").width;

  return (
    <View className="h-full items-center bg-primary-light py-6 dark:bg-primary-dark">
      <TouchableWithoutFeedback onPress={navigation.goBack}>
        <View className="mx-auto w-11/12">
          <XMarkIcon
            size={36}
            color={
              colorScheme === "light" ? colors.typo.light : colors.typo.dark
            }
          />
        </View>
      </TouchableWithoutFeedback>
      <Text className="text-5xl font-bold text-typo-light dark:text-typo-dark">
        Receive
      </Text>
      <WebView
        style={{ width: windowWidth }}
        source={{ uri: "https://reactnative.dev/" }}
      />
    </View>
  );
};

export default OnrampScreen;
