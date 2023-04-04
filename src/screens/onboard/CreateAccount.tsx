import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  useColorScheme,
  Animated,
} from "react-native";
import ActionButton from "../../components/ActionButton";
import * as SecureStore from "expo-secure-store";
import useUserStore from "../../state/user";
import { Wallet, ethers } from "ethers";
import useTokensStore from "../../state/tokens";
import "react-native-get-random-values";
import { makeRedirectUri, startAsync } from "expo-auth-session";
import { supabase, supabaseUrl } from "./supabase";
import GDrive from "expo-google-drive-api-wrapper";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { encrypt } from "./encrypt";

WebBrowser.maybeCompleteAuthSession();

const secureSave = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export default function CreateAccount({ navigation }: { navigation: any }) {
  const [token, setToken] = useState("");
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState("");

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

  const { wallet, login } = useUserStore((state) => ({
    wallet: state.wallet,
    login: state.login,
  }));
  const colorScheme = useColorScheme();

  const fetchTokensStatic = useTokensStore((state) => state.fetchTokensStatic);

  const [heroSentence, setHeroSentence] = useState(
    "Generating your account..."
  );
  const [intro, setIntro] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const createAccount = async () => {
    const privKey = await SecureStore.getItemAsync("privKey");
    if (privKey) {
      console.log("Already an account here !");
      login(new Wallet(privKey));
      return;
    } else {
      const privateKeyBytes = new Uint8Array(32);
      crypto.getRandomValues(privateKeyBytes);
      const privateKey = Buffer.from(privateKeyBytes);
      const newWallet = new ethers.Wallet(privateKey);
      await secureSave("privKey", newWallet.privateKey);
      login(newWallet);
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response!.authentication!.accessToken);
    }
  }, [response, token]);

  useEffect(() => {
    createAccount();
    fetchTokensStatic();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 3000);
  }, [fadeAnim]);

  useEffect(() => {
    if (!intro) {
      setHeroSentence("Account generated");
      return;
    }
    setTimeout(() => {
      if (heroSentence.length >= 26) {
        setHeroSentence("Generating your account");
      } else {
        setHeroSentence(heroSentence + ".");
      }
    }, 200);
  }, [heroSentence]);

  useEffect(() => {
    setTimeout(() => {
      setIntro(false);
    }, 3000);
  }, []);

  const connectDrive = async () => {
    await promptAsync();
    if (response?.type === "success") {
      setToken(response!.authentication!.accessToken);
    }
    // await GDrive.setAccessToken(authResponse.params.access_token);
    await GDrive.setAccessToken(token);
    await GDrive.init();
    (await GDrive.isInitialized())
      ? setStep(1)
      : console.log("not initialized");
  };

  const secureAccount = async () => {
    const key = await SecureStore.getItemAsync("privKey");
    const encryptedKey = await encrypt(key!, password);
    console.log(encryptedKey);
    const decryptedKey = await encrypt(encryptedKey, password);
    console.log(decryptedKey);
    let directoryId = await GDrive.files.safeCreateFolder({
      name: "bangr backups",
      parents: ["root"],
    });
    const file = await GDrive.files.createFileMultipart(
      encryptedKey,
      "text/plain",
      {
        parents: [directoryId],
        name: "bangr.wallet",
      },
      false
    );
    navigation.navigate("Wallet");
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
        <Text className="mt-2 font-[InterBold] text-[25px] leading-9 text-typo-light dark:text-typo-dark">
          {heroSentence}
        </Text>

        <Image
          className="mx-auto mt-20 h-64 w-64"
          source={require("../../../assets/figma/processor.png")}
        />
      </View>

      <View className="mx-auto mb-8 w-11/12">
        {/* the password field */}
        {step === 1 ? (
          <View className="flex mb-10">
          <Text className="font-[Inter] text-base text-typo-light dark:text-typo-dark">
            Password
          </Text>
          <TextInput
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text className="my-2 text-center font-[InterBold] text-lg text-typo-light dark:text-typo-dark">
              Your account is now ready
            </Text>
            <Text className="mx-auto mb-5 w-52 text-center font-[Inter] text-base text-typo-light dark:text-typo-dark">
              Before we take you to it, let's secure it !
            </Text>
          </Animated.View>
        )}
        <ActionButton
          text={step === 0 ? "Connect to Google Drive" : "Secure my account"}
          spinner={intro}
          bold
          rounded
          action={
            step === 0
              ? () => {
                  connectDrive();
                }
              : () => {
                  secureAccount();
                }
          }
        />
        <TouchableOpacity
          className={intro ? "opacity-0" : ""}
          onPress={() => {
            navigation.navigate("Wallet");
            fetchTokensStatic();
          }}
        >
          <Text className="mt-4 text-center text-typo-light dark:text-typo-dark">
            I don't want to secure my account now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
