import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  useColorScheme,
} from "react-native";
import { Buffer } from "buffer";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import useUserStore from "../state/user";
import "@ethersproject/shims";
import { Wallet } from "ethers";
import useTokensStore from "../state/tokens";
import { skipBiometrics } from "../config/configs";
global.Buffer = global.Buffer || Buffer;

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();
  const { login } = useUserStore((state) => ({
    login: state.login,
  }));
  const fetchTokensStatic = useTokensStore((state) => state.fetchTokensStatic);

  useEffect(() => {
    checkPreviousUser();
    fetchTokensStatic();
  }, []);

  const loginThroughBiometrics = async () => {
    if (skipBiometrics) return true;
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
    // handle no biometrics available. For now, just returns true
    return true;
  };

  const checkPreviousUser = async () => {
    const privKey = await SecureStore.getItemAsync("privKey");
    // const privKey = null;
    if (!privKey) {
      navigation.navigate("FirstScreen");
      return;
    }
    if (await loginThroughBiometrics()) {
      console.log("azeaze");
      login(new Wallet(privKey));
      navigation.navigate("Wallet");
    }
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      <Text className="mt-16 text-center text-4xl text-typo-light dark:text-typo-dark">
        Welcome to Bangr. Please login to continue.
      </Text>
    </SafeAreaView>
  );
};

export default LoginScreen;
