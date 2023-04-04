import React, { useEffect, useState } from "react";
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
import * as SecureStore from "expo-secure-store";
import GDrive from "expo-google-drive-api-wrapper";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { decrypt, encrypt } from "./encrypt";
import { FallbackProvider } from "@ethersproject/providers";
import * as FileSystem from "expo-file-system";
import CryptoES from "crypto-es";

WebBrowser.maybeCompleteAuthSession();

const secureSave = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  const [token, setToken] = useState("");
  const [step, setStep] = useState(0);
  const colorScheme = useColorScheme();

  const [request, response, promptAsync] = Google.useAuthRequest({
    // androidClientId: "12611559241-mq3b4m9io2kv41v8drjuebtij9ijip4i.apps.googleusercontent.com",
    // iosClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    clientId:
      "12611559241-beblq19nsim1rbt9rq9tvuh6joq35nj4.apps.googleusercontent.com",
    expoClientId:
      "12611559241-4112eljndg8c4suunqabmr0catb6m4ed.apps.googleusercontent.com",
    // scopes: ["drive.file"],
    // scopes: ["file"],
    scopes: ["https://www.googleapis.com/auth/drive.file"],
    // redirectUri: "https://auth.expo.io/@ndlz/poche",
    redirectUri: "https://auth.expo.io/@ndlz/poche-app",

    // usePKCE: true,
  });

  const connectDrive = async () => {
    await promptAsync();
    if (response?.type === "success") {
      setToken(response!.authentication!.accessToken);
    }
    await GDrive.setAccessToken(token);
    await GDrive.init();
    (await GDrive.isInitialized())
      ? setStep(1)
      : console.log("not initialized");
  };

  const restoreAccount = async () => {
    const directoryId = await GDrive.files.safeCreateFolder({
      name: "bangr backups",
      parents: ["root"],
    });
    console.log("directoryId", directoryId);
    const fileid = await GDrive.files.getId(
      "bangr.wallet",
      [directoryId],
      "text/plain"
    );
    console.log("file", fileid);
    const queryParams = {
      mimeType: "text/plain",
    };
    const fileContent = await GDrive.files.download([fileid], queryParams);
    console.log("fileContent", fileContent.uri);
    // get the file content with FileSystem
    FileSystem.readAsStringAsync(fileContent.uri)
      .then(async (content) => {
        // console.log(content);
        // uncrypt the content
        const decrypted = await decrypt(content, "123456");
        // console.log(decrypted);
        secureSave("privKey", decrypted);
        // delete the file with FileSystem
        await FileSystem.deleteAsync(fileContent.uri);
        navigation.navigate("Wallet");
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response!.authentication!.accessToken);
    }
  }, [response, token]);

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
          Managing investments is easy with Bangr
        </Text>

        <Image
          className="mx-auto mt-16 h-80 w-80"
          source={require("../../../assets/figma/phone.png")}
        />
      </View>

      <View className="mx-auto w-11/12">
        <ActionButton
          text="Create my account"
          bold
          rounded
          visible={step === 0 ? true : false}
          action={() => navigation.navigate("CreateAccount")}
        />
      </View>
      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text={step === 0 ? "Connect to my Drive" : "Restore my account"}
          bold
          rounded
          action={
            () => (step === 0 ? connectDrive() : restoreAccount())
            // connect to google drive
          }
        />
      </View>
    </SafeAreaView>
  );
}
