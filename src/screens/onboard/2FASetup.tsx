import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  useColorScheme,
  Platform,
  ActivityIndicator,
} from "react-native";
import ActionButton from "../../components/ActionButton";
import { encrypt, decrypt } from "../../utils/encrypt";
import { colors } from "../../config/configs";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import * as SecureStore from "expo-secure-store";
import useUserStore from "../../state/user";
import { ethers } from "ethers";

NfcManager.start();

export default function TwoFASetup({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const { login } = useUserStore((state) => ({
    login: state.login,
  }));

  const secureSave = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  };

  async function writeNdef() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      //generate a random password of 72 characters
      const randomPassword = await generateRandomPassword();
      // separate the password into 6 parts
      // write a new NDEF message composed of the 6 parts
      console.log(randomPassword);
      const bytes = Ndef.encodeMessage([
        Ndef.textRecord(randomPassword.slice(0, 12)),
        Ndef.textRecord(randomPassword.slice(12, 24)),
        Ndef.textRecord(randomPassword.slice(24, 36)),
        Ndef.textRecord(randomPassword.slice(36, 48)),
        Ndef.textRecord(randomPassword.slice(48, 60)),
        Ndef.textRecord(randomPassword.slice(60, 72)),
      ]);

      if (bytes) {
        await NfcManager.ndefHandler // STEP 2
          .writeNdefMessage(bytes); // STEP 3
      }

      console.log("NDEF message written");
      console.log(randomPassword);

      const privKey = await SecureStore.getItemAsync("privKey");
      const decryptedPrivKey = await decrypt(privKey!, randomPassword);
      // console.log(decryptedPrivKey);
      //login
      await login(new ethers.Wallet(decryptedPrivKey!));
      navigation.navigate("Wallet");
    } catch (ex) {
      console.warn(ex);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest();
    }
  }

  async function generateRandomPassword() {
    // generate a random password of 72 characters
    const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randomPassword = Array(72)
      .fill(s)
      .map((x) => x[Math.floor(Math.random() * x.length)])
      .join("");

    // get privKey from secure store
    const privKey = await SecureStore.getItemAsync("privKey");
    // encrypt the privKey with the random password
    const encryptedPrivKey = await encrypt(privKey!, randomPassword);
    // save the encrypted privKey to secure store
    await secureSave("privKey", encryptedPrivKey);
    // save the indicator that the user has a 2FA card
    await secureSave("2faPass", "true");
    return randomPassword;
  }

  writeNdef();

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
            <Text className="ml-1 mt-1 font-[InterSemiBold] text-base text-typo-light dark:text-typo-dark">
              2FA Card setup
            </Text>
          </View>
          <Text className="mt-2 font-[InterBold] text-[25px] leading-9 text-typo-light dark:text-typo-dark">
            Tap your 2FA card to your phone
          </Text>
        </View>
        {/* <Image
          className="mx-auto mt-8 h-52 w-52"
          source={require("../../../assets/figma/security.png")}
        /> */}
        <View className="flex-row items-center justify-center">
          <Image
            className="mx-auto mt-8 h-[200px] w-[300px]"
            source={require("../../../assets/2facard.png")}
          />
        </View>

        <View className="mx-auto mb-8 w-11/12">
          <ActionButton
            text={"I do not have a 2FA card"}
            bold
            rounded
            action={() => {
              navigation.navigate("Wallet");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
