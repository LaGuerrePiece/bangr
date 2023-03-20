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

export default function PasswordScreen({ navigation }: { navigation: any }) {
  console.log("PasswordScreen");

  return (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      <Text className="mt-16 text-center text-4xl text-typo-light dark:text-typo-dark">
        Salut ! Ici l'onboarding 2
      </Text>
      <TouchableOpacity
        className="mx-auto mt-16 h-12 w-1/2 rounded-lg bg-primary-dark dark:bg-primary-light"
        onPress={() => navigation.navigate("Password")}
      >
        <Text className="text-center text-typo-light dark:text-typo-dark">
          Go to page three
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
