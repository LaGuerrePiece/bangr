import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  useColorScheme,
} from "react-native";
import ActionButton from "../../components/ActionButton";
import useTokensStore from "../../state/tokens";

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const fetchTokensStatic = useTokensStore((state) => state.fetchTokensStatic);

  useEffect(() => {
    fetchTokensStatic();
  });

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto mt-12 w-11/12">
        <View className="flex-row">
          <Image
            className="h-6 w-6"
            source={
              colorScheme === "dark"
                ? require("../../../assets/newlogo.png")
                : require("../../../assets/newlogo_black.png")
            }
          />
          <Text className="ml-1 mt-1 font-[InterSemiBold] text-base text-typo-light dark:text-typo-dark">
            Welcome to Bangr
          </Text>
        </View>
        <Text className="mt-2 mr-4 font-[InterBold] text-[25px] leading-9 text-typo-light dark:text-typo-dark">
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("RestoreAccount");
          }}
        >
          <Text className="mt-4 text-center text-typo-light dark:text-typo-dark">
            Restore a previous account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
