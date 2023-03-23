import { View, Text, useColorScheme, Dimensions, Image } from "react-native";
import useUserStore from "../../state/user";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButton from "../../components/ActionButton";

export default function Bangramp({ navigation }: { navigation: any }) {
  const { smartWalletAddress, userInfo } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
    userInfo: state.userInfo,
  }));

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="mt-8 p-8">
        <Text className="mt-2 mr-4 text-center font-[InterBold] text-[22px] leading-9 text-typo-light dark:text-typo-dark">
          Let's get started
        </Text>
      </View>

      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text="Next"
          bold
          rounded
          action={() => navigation.navigate("CreateAccount")}
        />
      </View>
    </SafeAreaView>
  );
}
