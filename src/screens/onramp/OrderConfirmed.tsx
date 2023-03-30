import {
  View,
  Text,
  useColorScheme,
  Dimensions,
  Image,
  TouchableHighlight,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButton from "../../components/ActionButton";
import { TextInput } from "react-native-gesture-handler";
import { colors } from "../../config/configs";

export default function OrderConfirmed({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View>
        <View className="mt-2 p-8">
          <Text className="text-center font-[InterBold] text-2xl text-typo-light dark:text-typo-dark">
            Your order is confirmed !
          </Text>
        </View>

        <Text className="mx-auto w-10/12 text-center text-lg text-typo-light dark:text-typo-dark">
          Your order is confirmed and should arrive soon.
        </Text>
      </View>

      <Image
        className="mx-auto h-80 w-80"
        source={require("../../../assets/figma/payment.png")}
      />

      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text="Back to home"
          bold
          rounded
          action={() => navigation.navigate("Wallet")}
        />
      </View>
    </SafeAreaView>
  );
}
