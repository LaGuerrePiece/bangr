import React from "react";
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

export default function CreateAccount({ navigation }: { navigation: any }) {
  console.log("CreateAccountScreen");

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View>
        <Text className="mt-16 text-center font-[InterBold] text-2xl text-typo-light dark:text-typo-dark">
          Create your account now
        </Text>

        <Image
          className="mx-auto mt-32 h-56 w-56"
          source={require("../../../assets/figma/security.png")}
        />
      </View>

      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text="Create Account"
          action={() => navigation.navigate("CreateAccount")}
        />
      </View>
    </SafeAreaView>
  );
}
