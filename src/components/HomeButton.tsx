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
    <View className="m-auto mt-8 flex w-2/3 flex-row justify-evenly">
      <TouchableOpacity
        className=""
        onPress={() => navigation.navigate("Receive" as never, {} as never)}
      >
        <Image
          className="mx-4 h-14 w-14"
          source={require("../../assets/receivebtn.png")}
        />
        <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
          Receive
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showBuyToast}>
        <Image
          className="mx-12 h-14 w-14"
          source={require("../../assets/onrampbtn.png")}
        />
        <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
          Buy
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className=""
        onPress={() => navigation.navigate("Send" as never, {} as never)}
      >
        <Image
          className="mx-4 h-14 w-14"
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
