import React, { useEffect, useState } from "react";
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
import "react-native-get-random-values";
// @ts-ignore
import GDrive from "expo-google-drive-api-wrapper";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { encrypt } from "../../utils/encrypt";
import { colors } from "../../config/configs";
import { googleConfig } from "./RestoreAccount";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const driveName = Platform.OS === "ios" ? "iCloud" : "Google Drive";

WebBrowser.maybeCompleteAuthSession();

export default function ChoosePassword({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();

  const [step, setStep] = useState(0); // 0: default, 1: success
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [, response, promptAsync] = Google.useAuthRequest(googleConfig);

  const secureAccount = () => {
    setLoading(true);
    promptAsync();
  };

  useEffect(() => {
    if (response?.type === "success") {
      console.log("responseFromHook", response);
      if (!response.authentication?.accessToken) {
        console.log("no authentication token");
        Toast.show({
          type: "error",
          text1: "Could not authenticate with Google",
        });
        setLoading(false);
        return;
      }
      getUserInfo(response.authentication.accessToken);
    }
  }, [response]);

  const getUserInfo = async (accessToken: string) => {
    GDrive.setAccessToken(accessToken);
    GDrive.init();
    const initialized = await GDrive.isInitialized();
    console.log("initialized");
    if (!initialized) {
      console.log("not initialized");
      Toast.show({
        type: "error",
        text1: "Could not authenticate with Google",
      });
      setLoading(false);
      return;
    }
    const key = (await SecureStore.getItemAsync("privKey")) as string;
    const encryptedKey = await encrypt(key, password);
    console.log("encryptedKey", encryptedKey);
    const decryptedKey = await encrypt(encryptedKey, password);
    const directoryId = await GDrive.files.safeCreateFolder({
      name: "bangr backups",
      parents: ["root"],
    });
    console.log("directoryId", directoryId);
    const file = await GDrive.files.createFileMultipart(
      encryptedKey,
      "text/plain",
      {
        parents: [directoryId],
        name: "bangr.wallet",
      },
      false
    );
    console.log("file", JSON.stringify(file));
    Toast.show({
      type: "success",
      text1: "Account secured",
      text2: "Your account is now secured on " + driveName,
    });
    setLoading(false);
    setStep(1);
  };

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
            <Text className="ml-1 mt-1 font-[InterSemiBold] text-base text-typo-light dark:text-typo-dark">
              Welcome to Bangr
            </Text>
          </View>
          <Text className="mt-2 font-[InterBold] text-[25px] leading-9 text-typo-light dark:text-typo-dark">
            Secure on {driveName}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" className="mt-32" />
          ) : step === 0 ? (
            <View className="mt-6 mb-24">
              <Text className="my-3 text-center font-[Inter] text-base text-typo-light dark:text-typo-dark">
                Bangr will store an encrypted copy of your key on {driveName}.{" "}
                {"\n"}
                If you ever lose your phone, you will be able to recover your
                account. {"\n"}
                Be sure not to loose your password!
              </Text>
              <Text className="my-2 text-center font-[Inter] text-xl text-typo-light dark:text-typo-dark">
                Create a new password:
              </Text>
              <View className="mx-auto w-2/3 rounded-md border border-[#4F4F4F] bg-primary-light p-1 dark:bg-primary-dark">
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
            </View>
          ) : (
            <View className="mx-auto mt-12 flex-row items-center">
              <Image
                className="h-6 w-6"
                source={require("../../../assets/green_check.png")}
              />
              <Text className="ml-2 text-center font-[Inter] text-xl text-typo-light dark:text-typo-dark">
                Backup successful!
              </Text>
            </View>
          )}
        </View>

        {/* <Image
          className="mx-auto mt-8 h-52 w-52"
          source={require("../../../assets/figma/security.png")}
        /> */}

        <View className="mx-auto mb-8 w-11/12">
          <ActionButton
            text={step === 0 ? "Save to " + driveName : "Next"}
            bold
            rounded
            action={() => {
              step === 0 ? secureAccount() : navigation.navigate("Wallet");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
