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

export default function InvestEasily({ navigation }: { navigation: any }) {
  console.log("InvestEasilyScreen");

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View>
        <Text className="mt-16 text-center font-[InterBold] text-2xl text-typo-light dark:text-typo-dark">
          Deposit anywhere in DeFi
        </Text>
        <Text className="mt-4 text-center font-[InterMedium] text-lg text-typo-light dark:text-typo-dark">
          And watch your money grow !
        </Text>

        <Image
          className="mx-auto mt-32 h-56 w-56"
          source={require("../../../assets/figma/phone.png")}
        />
      </View>

      <View className="mx-auto mb-8 w-11/12 flex-row">
        <View className="mx-auto w-36">
          <ActionButton
            text="Skip"
            action={() => navigation.navigate("CreateAccount")}
          />
        </View>
        <View className="mx-auto w-36">
          <ActionButton
            text="Next"
            action={() => navigation.navigate("CreateAccount")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
