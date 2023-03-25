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
import ActionButton from "../../../components/ActionButton";
import { TextInput } from "react-native-gesture-handler";
import { colors } from "../../../config/configs";

export default function Bangramp({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View>
        <View className="p-8">
          <Text className="mt-2 mr-4 text-center font-[InterBold] text-[22px] leading-9 text-typo-light dark:text-typo-dark">
            Your order is confirmed !
          </Text>
        </View>

        <Text className="text-center text-typo-light dark:text-typo-dark">
          Your order is confirmed and will arrive soon.
        </Text>
      </View>

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
