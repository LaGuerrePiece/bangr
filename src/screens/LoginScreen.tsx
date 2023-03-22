import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  useColorScheme,
} from "react-native";
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
import { colors, skipBiometrics } from "../config/configs";
global.Buffer = global.Buffer || Buffer;

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();
  const { login, setUserInfo } = useUserStore((state) => ({
    login: state.login,
    setUserInfo: state.setUserInfo,
  }));
  const fetchTokensStatic = useTokensStore((state) => state.fetchTokensStatic);
  const fetchVaults = useVaultsStore((state) => state.fetchVaults);

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
    // handle no biometrics available
  };

  const checkPreviousUser = async () => {
    const privKey = await SecureStore.getItemAsync("privKey");
    if (!privKey) {
      navigation.navigate("Welcome");
      return;
    }

    if (await loginThroughBiometrics()) {
      login(new Wallet(privKey));
      navigation.navigate("Wallet");
    }
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      <Text className="mt-16 text-center text-4xl text-typo-light dark:text-typo-dark">
        Welcome to Poche
      </Text>
    </SafeAreaView>
  );
};

export default LoginScreen;
