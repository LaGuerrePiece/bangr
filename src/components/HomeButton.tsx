import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";

const HomeButton = () => {
  const navigation = useNavigation() as any;
  const colorScheme = useColorScheme();

  return (
    <View className="m-auto mt-4 flex w-11/12 flex-row justify-evenly">
      <TouchableOpacity
        className="w-1/3"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate("Receive", {});
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
        onPress={() => navigation.navigate("Onramp", {})}
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
          navigation.navigate("Send", {});
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
