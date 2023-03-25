import {
  View,
  Text,
  useColorScheme,
  Dimensions,
  Image,
  TouchableHighlight,
} from "react-native";
import useUserStore from "../../../state/user";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButton from "../../../components/ActionButton";
import { TextInput } from "react-native-gesture-handler";
import { colors } from "../../../config/configs";
import { useState } from "react";
import useBangrampStore from "../../../state/bangramp";

export default function BangrampInfoScreen({
  navigation,
}: {
  navigation: any;
}) {
  const smartWalletAddress = useUserStore((state) => state.smartWalletAddress);

  const bangrampState = useBangrampStore();

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View>
        <View className="p-8">
          <Text className="mt-2 mr-4 text-center font-[InterBold] text-[22px] leading-9 text-typo-light dark:text-typo-dark">
            Add your card info
          </Text>
        </View>

        <View className="mx-auto w-11/12">
          <Text className="mb-2 text-typo-light dark:text-typo-dark">
            Email
          </Text>
          <TextInput
            placeholderTextColor={colors.typo2.light}
            className="w-full rounded-lg bg-secondary-light text-4xl font-semibold text-typo-light dark:bg-secondary-dark dark:text-typo-dark"
            onChangeText={(email: string) => {
              bangrampState.update({ email });
            }}
            value={bangrampState.email}
          />

          <Text className="mt-8 mb-2 text-typo-light dark:text-typo-dark">
            Name on card
          </Text>
          <TextInput
            placeholderTextColor={colors.typo2.light}
            className="w-full rounded-lg bg-secondary-light text-4xl font-semibold text-typo-light dark:bg-secondary-dark dark:text-typo-dark"
            onChangeText={(cardHolderName: string) => {
              bangrampState.update({ cardHolderName });
            }}
            value={bangrampState.cardHolderName}
          />

          <Text className="mt-8 mb-2 text-typo-light dark:text-typo-dark">
            Card information
          </Text>
          <TextInput
            placeholderTextColor={colors.typo2.light}
            className="w-full rounded-lg bg-secondary-light text-4xl font-semibold text-typo-light dark:bg-secondary-dark dark:text-typo-dark"
            onChangeText={(cardHolderName: string) => {
              bangrampState.update({ cardHolderName });
            }}
            value={bangrampState.cardHolderName}
          />
        </View>
      </View>

      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text="Next"
          bold
          rounded
          action={() => navigation.navigate("Confirm")}
        />
      </View>
    </SafeAreaView>
  );
}
