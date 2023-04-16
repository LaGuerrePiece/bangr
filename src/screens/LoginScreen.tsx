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
import { skipBiometrics, useNfc } from "../config/configs";
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
      if (useNfc) {
        console.log("nfc");
        navigation.navigate("NFC");
      } else {
        login(new Wallet(privKey));
        navigation.navigate("Wallet");
      }
    }
  };

  return (
    <SafeAreaView className="bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto h-full w-11/12 justify-between">
        <View className="mt-10">
          <Image
            className="mx-auto h-12 w-12"
            source={
              colorScheme === "dark"
                ? require("../../assets/newlogo.png")
                : require("../../assets/newlogo_black.png")
            }
          />
          <Text className="mx-auto mt-4 font-InterSemiBold text-lg text-typo-light dark:text-typo-dark">
            Welcome to Bangr
          </Text>
          <Text className="mx-auto mt-24 font-InterBold text-[25px] leading-9 text-typo-light dark:text-typo-dark">
            Please login to continue.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
