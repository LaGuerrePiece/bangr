import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  useColorScheme,
} from "react-native";
import ActionButton from "../components/ActionButton";
import Web3Auth, {
  LOGIN_PROVIDER,
  OPENLOGIN_NETWORK,
} from "@web3auth/react-native-sdk";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import useUserStore from "../state/user";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { Wallet } from "ethers";
import useTokensStore from "../state/tokens";
import useVaultsStore from "../state/vaults";
import { colors } from "../config/configs";
import { Toast } from "react-native-toast-message/lib/src/Toast";
global.Buffer = global.Buffer || Buffer;

const resolvedRedirectUrl =
  Constants.appOwnership == AppOwnership.Expo ||
  Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL("web3auth", {})
    : Linking.createURL("web3auth", { scheme: "poche" });

// My own clientId for testing purposes
const clientId =
  "BA8En8WOfQp35-DO3S578DeRyygudn38Ri1HYV43SAZb0CeqH6LNKe9qeZCgqBK60EEbb_g0mpHKFQRLYaL8Xc8";

const SdkInitParams = {
  clientId,
  network: OPENLOGIN_NETWORK.MAINNET,
  whiteLabel: {
    name: "Poche",
    logoLight: "https://i.imgur.com/bayJ8I1.png",
    logoDark: "https://i.imgur.com/bayJ8I1.png",
    theme: {
      primary: "#386CAF",
    },
  },
};

const web3auth = new Web3Auth(WebBrowser, SdkInitParams);

const secureSave = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const login = useUserStore((state) => state.login);
  const fetchTokensStatic = useTokensStore((state) => state.fetchTokensStatic);
  const fetchVaults = useVaultsStore((state) => state.fetchVaults);
  const [email, setEmail] = useState("");

  useEffect(() => {
    checkPreviousUser();
    fetchTokensStatic();
  }, []);

  const loginThroughBiometrics = async () => {
    if (
      (await LocalAuthentication.hasHardwareAsync()) &&
      (await LocalAuthentication.isEnrolledAsync())
    ) {
      return (
        await LocalAuthentication.authenticateAsync({
          promptMessage: "Enter",
        })
      ).success;
    }
  };

  const checkPreviousUser = async () => {
    const privKey = await SecureStore.getItemAsync("privKey");
    if (!privKey) return;

    if (await loginThroughBiometrics()) {
      login(new Wallet(privKey));
      navigation.navigate("Wallet" as never, {} as never);
    }
  };

  const handleLogin = async (loginProvider: string) => {
    const user = await web3auth.login({
      loginProvider: loginProvider,
      redirectUrl: resolvedRedirectUrl,
      extraLoginOptions: {
        login_hint: email,
      },
    });

    if (user.privKey) {
      secureSave("privKey", user.privKey);
      login(new Wallet(user.privKey));
      navigation.navigate("Wallet" as never, {} as never);
    }

    // TODO: handle failling
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      <Text className="mt-16 text-center text-4xl text-typo-light dark:text-typo-dark">
        Welcome to Poche
      </Text>

      <View className="mx-auto mt-16 flex w-2/3">
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={() => handleLogin("google")}>
            <View className="my-2 h-14 w-14 rounded-3xl bg-btn-light dark:bg-btn-dark">
              <Image
                className="mx-auto my-auto h-7 w-7"
                source={require("../../assets/Google.png")}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLogin("apple")}>
            <View className="my-2 h-14 w-14 rounded-3xl bg-btn-light dark:bg-btn-dark">
              <Image
                className="mx-auto my-auto h-7 w-7"
                source={require("../../assets/Apple.png")}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLogin("twitter")}>
            <View className="my-2 h-14 w-14 rounded-3xl bg-btn-light dark:bg-btn-dark">
              <Image
                className="mx-auto my-auto h-7 w-7"
                source={require("../../assets/Twitter.png")}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <View className="mx-auto mt-6 w-full rounded-xl border-2 bg-primary-light p-1 dark:bg-primary-dark">
            <TextInput
              style={{
                color:
                  colorScheme === "light"
                    ? colors.typo.light
                    : colors.typo.dark,
              }}
              placeholderTextColor={colors.typo2.light}
              className="my-1 text-lg font-semibold text-typo-light dark:text-typo-dark"
              onChangeText={(value) => setEmail(value)}
              value={email}
              placeholder="bob@pm.me"
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!validateEmail(email)) {
                Toast.show({
                  type: "error",
                  text1: "Input error",
                  text2: "This does not look like a valid email",
                });
                return;
              }
              handleLogin("email_passwordless");
            }}
          >
            <View className="my-3 h-14 flex-row items-center justify-around rounded-3xl bg-btn-light px-1 dark:bg-btn-dark">
              <Image
                className="h-7 w-7"
                source={require("../../assets/Mail.png")}
              />
              <Text className="w-fit text-center text-lg text-secondary-light dark:text-secondary-dark">
                Connect with email
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
