import { View, Text, SafeAreaView } from "react-native";
import ActionButton from "../components/ActionButton";
import Web3Auth, { OPENLOGIN_NETWORK } from "@web3auth/react-native-sdk";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Buffer } from "buffer";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import useUserStore from "../state/user";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { Wallet } from "ethers";
import useTokensStore from "../state/tokens";
import useVaultsStore from "../state/vaults";
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
};

const web3auth = new Web3Auth(WebBrowser, SdkInitParams);

const secureSave = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const login = useUserStore((state) => state.login);
  const fetchTokensStatic = useTokensStore((state) => state.fetchTokensStatic);
  const fetchVaults = useVaultsStore((state) => state.fetchVaults);

  useEffect(() => {
    checkPreviousUser();
    fetchTokensStatic();
  });

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

  const handleLogin = async () => {
    const user = await web3auth.login({ redirectUrl: resolvedRedirectUrl });
    if (user.privKey) {
      secureSave("privKey", user.privKey);
      login(new Wallet(user.privKey));
      navigation.navigate("Wallet" as never, {} as never);
    }

    // TODO: handle failling
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      <Text className="mt-16 text-center text-4xl text-typo-light dark:text-typo-dark">
        Welcome to Poche
      </Text>

      <View className="mx-auto mt-32 flex h-1/4 w-2/3 justify-between">
        <ActionButton text="It's my first time here" action={handleLogin} />

        <ActionButton
          text="Recover previous account"
          action={() => console.log("recover account")}
          disabled={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
