import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  useColorScheme,
  TouchableOpacity,
  Linking,
} from "react-native";
import ActionButton from "../../components/ActionButton";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";
import { colors, VALID_CODES } from "../../config/configs";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export default function CodeScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [code, setCode] = useState("");

  return (
    <SafeAreaView className="bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto h-full w-11/12 justify-between">
        <View className="mt-10">
          <View className="flex-row">
            <Image
              className="h-6 w-6"
              source={
                colorScheme === "dark"
                  ? require("../../../assets/newlogo.png")
                  : require("../../../assets/newlogo_black.png")
              }
            />
            <Text className="ml-1 mt-1 font-InterSemiBold text-base text-typo-light dark:text-typo-dark">
              {t("OnboardScreenWelcome")}
            </Text>
          </View>
          <Text className="mt-2 font-InterBold text-[25px] leading-9 text-typo-light dark:text-typo-dark">
            {t("CodeScreenWelcome")}
          </Text>
        </View>

        {/* <Image className="mx-auto h-64 w-64" source={image} /> */}

        <View>
          <Text className="my-3 text-center font-InterBold text-lg text-typo-light dark:text-typo-dark">
            {t("CodeScreenPrompt")}
          </Text>

          <View className="mx-auto w-2/3 rounded-md border border-[#4F4F4F] bg-primary-light p-1 dark:bg-primary-dark">
            <TextInput
              placeholderTextColor={colors.typo2.light}
              className="text-xl font-semibold text-typo-light dark:text-typo-dark"
              onChangeText={(text) => setCode(text)}
              value={code}
              placeholder={t("CodePlaceholder") ?? "your code"}
              style={{
                color:
                  colorScheme === "light"
                    ? colors.typo.light
                    : colors.typo.dark,
              }}
            />
          </View>
          <Text className="mx-auto my-3 w-64 text-center font-[Inter] text-base text-typo-light dark:text-typo-dark">
            {t("EnterItHere")}
          </Text>
        </View>

        <View className="mb-8">
          <ActionButton
            text={t("Next")}
            bold
            rounded
            action={() => {
              if (VALID_CODES.includes(code)) {
                navigation.navigate("FirstScreen");
              } else {
                Toast.show({
                  type: "error",
                  text1: "Invalid code",
                  text2: "Get one first !",
                });
              }
            }}
          />
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.bangr.app/")}
          >
            <Text className="mt-4 text-center text-typo-light dark:text-typo-dark">
              {t("HowDoIDo")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
