import {
  View,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  Image,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { colors } from "../config/configs";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { TouchableOpacity } from "react-native";
import { toastConfig } from "../components/toasts";

const OnrampScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();

  const RampOption = ({
    logo,
    text,
    title,
    screen,
  }: {
    logo: number;
    text: string;
    title: string;
    screen: string;
  }) => {
    return (
      <TouchableOpacity
        className="my-3 w-11/12"
        onPress={() => {
          navigation.navigate(screen);
        }}
      >
        <View className="flex items-center rounded-xl bg-secondary-light p-4 text-xl dark:bg-secondary-dark">
          <Text className="text-center text-2xl font-bold text-typo-light dark:text-typo-dark">
            {title}
          </Text>
          <Image className="h-48 w-48" source={logo} />
          <Text className="text-center text-typo-light dark:text-typo-dark">
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
      <View className="flex w-full items-center">
        <RampOption
          logo={require("../../assets/figma/ethereum.png")}
          text={"For a small amount (<$100), the simplest is to pay by card"}
          title={"Card"}
          // screen={"Transak"}
          screen={"Bangramp"}
        />
        <RampOption
          logo={require("../../assets/figma/ethereum3.png")}
          text={
            "For a bigger amount, the best is bank transfer. You'll have to KYC."
          }
          title={"Bank transfer"}
          // screen={"Monerium"}
          screen={"Wallet"}
        />
      </View>
      <Toast config={toastConfig} />
    </View>
  );
};

export default OnrampScreen;
