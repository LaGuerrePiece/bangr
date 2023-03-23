import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import * as Haptics from "expo-haptics";

const HomeButton = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const showBuyToast = () => {
    Toast.show({
      type: "info",
      text1: "Not available yet",
      text2: "We are working on simple on-ramping, stay tuned!",
    });
  };

  return (
    <View className="m-auto mt-4 flex w-11/12 flex-row justify-evenly">
      <TouchableOpacity
        className="w-1/3"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate("Receive" as never, {} as never);
        }}
      >
        <Image
          className="m-auto h-8 w-8"
          source={
            colorScheme === "light"
              ? require("../../assets/receive.png")
              : require("../../assets/receive-drk.png")
          }
        />
        <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
          Receive
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        className="w-1/3"
        onPress={() => navigation.navigate("Onramp" as never, {} as never)}
      >
        <Image
          className="m-auto h-14 w-14"
          source={colorScheme === "light" ? require("../../assets/onrampbtn.png") : require("../../assets/onrampbtn-drk.png")}
        />
        <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
          Buy
        </Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        className="w-1/3"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate("Send" as never, {} as never);
        }}
      >
        <Image
          className="m-auto h-8 w-8"
          source={
            colorScheme === "light"
              ? require("../../assets/send.png")
              : require("../../assets/send-drk.png")
          }
        />
        <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
          Send
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeButton;
