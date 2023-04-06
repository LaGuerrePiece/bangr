import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import ActionButton from "../../components/ActionButton";
import * as SecureStore from "expo-secure-store";
// @ts-ignore
import GDrive from "expo-google-drive-api-wrapper";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { decrypt, encrypt } from "./encrypt";
import * as FileSystem from "expo-file-system";
import CryptoES from "crypto-es";
import { ethers } from "ethers";
import useUserStore from "../../state/user";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { colors } from "../../config/configs";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const secureSave = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const googleConfig = {
  androidClientId: "12611559241-mq3b4m9io2kv41v8drjuebtij9ijip4i.apps.googleusercontent.com",
  // iosClientId: "GOOGLE_GUID.apps.googleusercontent.com",
  // clientId:
    // "12611559241-beblq19nsim1rbt9rq9tvuh6joq35nj4.apps.googleusercontent.com",
  expoClientId:
    "12611559241-4112eljndg8c4suunqabmr0catb6m4ed.apps.googleusercontent.com",
  // scopes: ["drive.file"],
  // scopes: ["file"],
  scopes: ["https://www.googleapis.com/auth/drive.file"],
  // redirectUri: "https://auth.expo.io/@ndlz/poche",
  // redirectUri: "https://auth.expo.io/@ndlz/poche-app",
  redirectUrl : makeRedirectUri({
    path: '/auth/callback',
    preferLocalhost: true,
  })

  // usePKCE: true,
};

export default function RestoreAccount({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const login = useUserStore((state) => state.login);

  const [step, setStep] = useState(0); // 0: default, 1: connected to drive
  const [password, setPassword] = useState("");
  const [fileContentUri, setFileContentUri] = useState("");
  const [encryptedKey, setEncryptedKey] = useState("");
  const [loading, setLoading] = useState(false);

  const [, response, promptAsync] = Google.useAuthRequest(googleConfig);

  const connectDrive = async () => {
    await promptAsync();
    setStep(1);
    setLoading(true);
    if (response?.type !== "success") {
      Toast.show({
        type: "error",
        text1: "Authorization failed",
        text2: "Please try again !",
      });
      setLoading(false);
      return;
    }
    const token = response.authentication!.accessToken;
    await GDrive.setAccessToken(token);
    await GDrive.init();
    const initialized = await GDrive.isInitialized();
    if (!initialized) {
      console.log("not initialized");
      setLoading(false);
      return;
    }
    const directoryId = await GDrive.files.safeCreateFolder({
      name: "bangr backups",
      parents: ["root"],
    });
    const fileid = await GDrive.files.getId(
      "bangr.wallet",
      [directoryId],
      "text/plain"
    );
    const queryParams = {
      mimeType: "text/plain",
    };
    const fileContent = await GDrive.files.download([fileid], queryParams);
    setFileContentUri(fileContent.uri);
    const content = await FileSystem.readAsStringAsync(fileContent.uri);
    if (!content) {
      Toast.show({
        type: "error",
        text1: "No backup found",
        text2: "Please try again !",
      });
      setLoading(false);
      return;
    }
    setEncryptedKey(content);
    setLoading(false);
  };

  const restoreAccount = async () => {
    try {
      const decrypted = await decrypt(encryptedKey, password);
      secureSave("privKey", decrypted);
      login(new ethers.Wallet(decrypted));
      await FileSystem.deleteAsync(fileContentUri);
      navigation.navigate("Wallet");
    } catch (e) {
      console.log(e);
      Toast.show({
        type: "error",
        text1: "Wrong password",
        text2: "Please try again !",
      });
    }
  };

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto mt-20 w-11/12">
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
          Restore a previous account from your Drive
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
                No Backup found !
              </Text>
            </View>
            <Text className="my-2 text-center font-[Inter] text-xl text-typo-light dark:text-typo-dark">
              Please contact us
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
                Backup found !
              </Text>
            </View>
            <Text className="my-2 text-center font-[Inter] text-xl text-typo-light dark:text-typo-dark">
              Enter your password here :
            </Text>
            <View className="mx-auto w-2/3 rounded-md border bg-primary-light p-1 dark:bg-primary-dark">
              <TextInput
                placeholderTextColor={colors.typo2.light}
                className="text-xl font-semibold text-typo-light dark:text-typo-dark"
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder="password"
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

      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text={
            encryptedKey === "" ? "Connect to my Drive" : "Restore my account"
          }
          bold
          rounded
          action={() =>
            encryptedKey === "" ? connectDrive() : restoreAccount()
          }
        />
      </View>
    </SafeAreaView>
  );
}
