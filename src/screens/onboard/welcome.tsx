import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  useColorScheme,
} from "react-native";
import ActionButton from "../../components/ActionButton";

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="mt-8 p-8">
        <View className="flex-row">
          <Image
            className="h-6 w-6"
            source={require("../../../assets/newlogo.png")}
          />
          <Text className="ml-1 mt-1 font-[InterSemiBold] text-base text-typo-light dark:text-typo-dark">
            Welcome to Bangr
          </Text>
        </View>
        <Text className="mt-2 mr-4 font-[InterBold] text-[22px] leading-9 text-typo-light dark:text-typo-dark">
          Managing investments is easy with Bangr
        </Text>

        <Image
          className="mx-auto mt-16 h-80 w-80"
          source={require("../../../assets/figma/phone.png")}
        />
      </View>

      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text="Create my account"
          bold
          rounded
          action={() => navigation.navigate("CreateAccount")}
        />
      </View>
    </SafeAreaView>
  );
}
