import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  useColorScheme,
  Animated,
  Platform,
} from "react-native";
import ActionButton from "../../components/ActionButton";
import * as SecureStore from "expo-secure-store";
import useUserStore from "../../state/user";
import { Wallet, ethers } from "ethers";
import { RootStackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { track } from "../../utils/analytics";

const secureSave = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export default function CreateAccount({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "CreateAccount">) {
  const colorScheme = useColorScheme();
  const { login } = useUserStore((state) => ({
    login: state.login,
  }));
  const { t } = useTranslation();

  const [heroSentence, setHeroSentence] = useState(t("generating") + "...");
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
    createAccount();
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
      setHeroSentence(t("accountGenerated") ?? "Account generated");
      return;
    }
    setTimeout(() => {
      if (heroSentence.length >= 26) {
        setHeroSentence(t("generating") ?? "Generating your account");
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
            <Text className="ml-1 mt-1 font-InterSemiBold text-base text-typo-light dark:text-typo-dark">
              {t("OnboardScreenWelcome")}
            </Text>
          </View>
          <Text className="mt-2 font-InterBold text-[25px] leading-9 text-typo-light dark:text-typo-dark">
            {heroSentence}
          </Text>
        </View>
        <Image
          className="mx-auto h-64 w-64"
          source={require("../../../assets/figma/processor.png")}
        />

        <View className="mb-8">
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text className="my-2 text-center font-InterBold text-lg text-typo-light dark:text-typo-dark">
              {t("accountReady")}
            </Text>
            <Text className="mx-auto mb-5 w-64 text-center font-[Inter] text-base text-typo-light dark:text-typo-dark">
              {t("letsSecureItOn")}
            </Text>
          </Animated.View>
          <ActionButton
            text={t("secureButton")}
            spinner={intro}
            bold
            rounded
            action={() => {
              navigation.navigate("ChoosePassword");
              track("Account created and secured");
            }}
          />
          <TouchableOpacity
            className={intro ? "opacity-0" : ""}
            onPress={() => {
              navigation.navigate("MainScreen", { screen: "Wallet" });
              track("Account created but not secured");
            }}
          >
            <Text className="mt-4 text-center text-typo-light dark:text-typo-dark">
              {t("dontWannaSecure")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
