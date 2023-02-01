import { useNavigation } from "@react-navigation/native";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const HomeButton = () => {
  const navigation = useNavigation();

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
        onPress={() => navigation.navigate("Receive" as never, {} as never)}
      >
        <Image
          className="m-auto h-14 w-14"
          source={require("../../assets/receivebtn.png")}
        />
        <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
          Receive
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="w-1/3" onPress={showBuyToast}>
        <Image
          className="m-auto h-14 w-14"
          source={require("../../assets/onrampbtn.png")}
        />
        <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
          Buy
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-1/3"
        onPress={() => navigation.navigate("Send" as never, {} as never)}
      >
        <Image
          className="m-auto h-14 w-14"
          source={require("../../assets/sendbtn2.png")}
        />
        <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
          Send
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeButton;
