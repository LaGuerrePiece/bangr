import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  useColorScheme,
  Platform,
  ActivityIndicator,
} from "react-native";
import ActionButton from "../../components/ActionButton";
import * as SecureStore from "expo-secure-store";
import { encrypt } from "../../utils/encrypt";
import { colors } from "../../config/configs";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "../../state/user";
import { RootStackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

const driveName = Platform.OS === "ios" ? "iCloud" : "Google Drive";

export default function ChoosePasswordICloud({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ChoosePassword">) {
  const colorScheme = useColorScheme();
  const setBackedUp = useUserStore((state) => state.setBackedUp);
  const { t } = useTranslation();

  const [step, setStep] = useState(0); // 0: default, 1: success
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  const saveAndShareFile = async (content: string) => {
    try {
      // Create a file with the content (key)
      const fileName = "bangr.wallet";
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Check if sharing is available on the device
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        alert("Sharing is not available on this device.");
        return;
      }

      // Share the file, allowing the user to save it to iCloud Drive
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/plain",
        dialogTitle: t("saveToICloud") ?? "Save the file to iCloud Drive",
      });
    } catch (error) {
      console.error("Error saving and sharing file:", error);
    }
  };

  const secureAccountICloud = async () => {
    setLoading(true);
    if (password !== password2) {
      Toast.show({
        type: "error",
        text1: t("passNotMatch") as string,
      });
      setLoading(false);
      return;
    }
    const key = (await SecureStore.getItemAsync("privKey")) as string;
    const encryptedKey = await encrypt(key, password);

    // Store in iCloud Drive (user interaction required)
    await saveAndShareFile(encryptedKey);

    Toast.show({
      type: "success",
      text1: "Account secured",
      text2: t("cloudOK") as string,
    });

    await AsyncStorage.setItem("backup", "true");
    setBackedUp(true);

    setLoading(false);
    setStep(1);
  };

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto mt-10 w-11/12">
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
            {t("OnboardScreenWelcome")}
          </Text>
        </View>
        <Text className="mt-2 font-[InterBold] text-[25px] leading-9 text-typo-light dark:text-typo-dark">
          {t("secureOn")} {driveName}
        </Text>

        {step === 0 ? (
          <View>
            <Text className="mt-3 mb-1 text-center font-[Inter] text-typo-light dark:text-typo-dark">
              {t("choosePasswordICloud1")}
            </Text>
            <Text className="mt-3 mb-1 text-center font-[Inter] text-typo-light dark:text-typo-dark">
              {t("choosePasswordICloud2")}
            </Text>
            <Text className="m-auto mt-3 w-11/12 text-center font-bold text-typo-light dark:text-typo-dark">
              {t("choosePasswordICloud3")}
            </Text>
            <Text className="my-2 text-center font-[Inter] text-xl text-typo-light dark:text-typo-dark">
              {t("createPassword")}
            </Text>
            <View className="mx-auto w-2/3 rounded-md border bg-primary-light p-1 dark:bg-primary-dark">
              <TextInput
                placeholderTextColor={colors.typo2.light}
                className="text-xl font-semibold text-typo-light dark:text-typo-dark"
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder="*******"
                secureTextEntry={true}
                style={{
                  color:
                    colorScheme === "light"
                      ? colors.typo.light
                      : colors.typo.dark,
                }}
              />
            </View>
            <Text className="my-2 text-center font-[Inter] text-xl text-typo-light dark:text-typo-dark">
              {t("repeatPassword")}
            </Text>
            <View className="mx-auto w-2/3 rounded-md border bg-primary-light p-1 dark:bg-primary-dark">
              <TextInput
                placeholderTextColor={colors.typo2.light}
                className="text-xl font-semibold text-typo-light dark:text-typo-dark"
                onChangeText={(text) => setPassword2(text)}
                value={password2}
                placeholder="*******"
                secureTextEntry={true}
                style={{
                  color:
                    colorScheme === "light"
                      ? colors.typo.light
                      : colors.typo.dark,
                }}
              />
            </View>
          </View>
        ) : loading ? (
          <ActivityIndicator size="large" className="mt-32" />
        ) : (
          <Text className="mt-12 text-center font-[Inter] text-xl text-typo-light dark:text-typo-dark">
            {t("backupSuccessful")}
          </Text>
        )}

        {/* <Image
          className="mx-auto mt-8 h-52 w-52"
          source={require("../../../assets/figma/security.png")}
        /> */}
      </View>

      {step === 0 && (
        <View className="m-auto w-11/12">
          <Text className="mt-3 mb-1 text-center font-[Inter] text-typo-light dark:text-typo-dark">
            {t("choosePasswordICloud4")}
          </Text>
          <Text className="my-2 text-center font-bold text-typo-light dark:text-typo-dark">
            {t("choosePasswordICloud5")}
          </Text>
        </View>
      )}

      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text={step === 0 ? t("saveToICloud") : t("Next")}
          bold
          rounded
          action={() => {
            step === 0
              ? secureAccountICloud()
              : // : navigation.navigate("MainScreen", { screen: "Wallet" });
                navigation.replace("MainScreen", { screen: "Wallet" });
          }}
        />
      </View>
    </SafeAreaView>
  );
}
