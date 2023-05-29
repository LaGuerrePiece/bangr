import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  useColorScheme,
  ActivityIndicator,
  Platform,
} from "react-native";
import ActionButton from "../../components/ActionButton";
import * as SecureStore from "expo-secure-store";
import { decrypt } from "../../utils/encrypt";
import * as FileSystem from "expo-file-system";
import { ethers } from "ethers";
import useUserStore from "../../state/user";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { colors } from "../../config/configs";
import * as DocumentPicker from "expo-document-picker";
import { RootStackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

const secureSave = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

const driveName = Platform.OS === "ios" ? "iCloud" : "Google Drive";

export default function RestoreAccountICloud({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "RestoreAccount">) {
  const colorScheme = useColorScheme();
  const login = useUserStore((state) => state.login);
  const { t } = useTranslation();

  const [step, setStep] = useState(0); // 0: default, 1: connected to drive
  const [password, setPassword] = useState("");
  const [encryptedKey, setEncryptedKey] = useState("");
  const [loading, setLoading] = useState(false);

  const readSelectedFile = async () => {
    try {
      // Open the document picker and let the user select a file
      const result = await DocumentPicker.getDocumentAsync();
      if (result.type === "success") {
        // Read the contents of the selected file
        const contents = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        console.log("File contents:", contents);
        return contents;
      } else {
        console.log("No file selected.");
        return "";
      }
    } catch (error) {
      console.error("Error reading file:", error);
      return "";
    }
  };

  const getICloudBackup = async () => {
    setLoading(true);

    setEncryptedKey(await readSelectedFile());

    setStep(1);
    setLoading(false);
  };

  const restoreAccount = async () => {

    try {
      const decrypted = await decrypt(encryptedKey, password);
      secureSave("privKey", decrypted);
      login(new ethers.Wallet(decrypted));
      navigation.navigate("MainScreen", { screen: "Wallet" });
    } catch (e) {
      console.log(e);
      Toast.show({
        type: "error",
        text1: t("wrongPassword"),
        text2: t("tryAgain"),
      });
    }
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
        <Text className="mt-2 mr-4 font-[InterBold] text-[25px] leading-9 text-typo-light dark:text-typo-dark">
          {t("restoreTitle")}
        </Text>

        {step === 0 ? (
          <Image
            className="mx-auto mt-16 h-80 w-80"
            source={require("../../../assets/figma/security.png")}
          />
        ) : loading ? (
          <ActivityIndicator size="large" className="mt-32" />
        ) : encryptedKey === "" ? (
          <View>
            <View className="my-5 mx-auto flex-row items-center">
              <Image
                className="h-6 w-6"
                source={require("../../../assets/red_cross.png")}
              />
              <Text className="ml-2 font-[Inter] text-lg text-typo-light dark:text-typo-dark">
                {t("noBackupFound")}
              </Text>
            </View>
            <Text className="my-2 text-center font-[Inter] text-xl text-typo-light dark:text-typo-dark">
              {t("pleaseContactUs")}
            </Text>
          </View>
        ) : (
          <View>
            <View className="my-5 mx-auto flex-row items-center">
              <Image
                className="h-6 w-6"
                source={require("../../../assets/green_check.png")}
              />
              <Text className="ml-2 font-[Inter] text-lg text-typo-light dark:text-typo-dark">
                {t("backupFound")}
              </Text>
            </View>
            <Text className="my-2 text-center font-[Inter] text-xl text-typo-light dark:text-typo-dark">
              {t("enterPassword")}
            </Text>
            <View className="mx-auto w-2/3 rounded-md border bg-primary-light p-1 dark:bg-primary-dark">
              <TextInput
                placeholderTextColor={colors.typo2.light}
                className="text-xl font-semibold text-typo-light dark:text-typo-dark"
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder={t("passwordPlaceHolder") ?? "password"}
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
        )}
      </View>

      {step === 0 && (
        <Text className="m-auto my-3 w-11/12 text-center font-[Inter] text-typo-light dark:text-typo-dark">
          {t("iosRestoreInstructions")}
        </Text>
      )}

      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text={
            encryptedKey === ""
              ? t("connectToOnButton") + `${driveName}`
              : t("restoreButton")
          }
          bold
          rounded
          action={() =>
            encryptedKey === "" ? getICloudBackup() : restoreAccount()
          }
        />
      </View>
    </SafeAreaView>
  );
}
