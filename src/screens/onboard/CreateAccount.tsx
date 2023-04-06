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
import "react-native-get-random-values";

const secureSave = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export default function CreateAccount({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const { login } = useUserStore((state) => ({
    login: state.login,
  }));

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

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto mt-10 w-11/12">
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
            Welcome to Bangr
          </Text>
        </View>
        <Text className="mt-2 font-InterBold text-[25px] leading-9 text-typo-light dark:text-typo-dark">
          {heroSentence}
        </Text>

        <Image
          className="mx-auto mt-20 h-64 w-64"
          source={require("../../../assets/figma/processor.png")}
        />
      </View>

      <View className="mx-auto mb-8 w-11/12">
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="my-2 text-center font-InterBold text-lg text-typo-light dark:text-typo-dark">
            Your account is now ready
          </Text>
          <Text className="mx-auto mb-5 w-64 text-center font-[Inter] text-base text-typo-light dark:text-typo-dark">
            Before we take you to it, let's secure it on{" "}
            {Platform.OS === "ios" ? "iCloud" : "Google Drive"} !
          </Text>
        </Animated.View>
        <ActionButton
          text={"Secure my account"}
          spinner={intro}
          bold
          rounded
          action={() => {
            navigation.navigate("ChoosePassword");
          }}
        />
        <TouchableOpacity
          className={intro ? "opacity-0" : ""}
          onPress={() => {
            navigation.navigate("Wallet");
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
