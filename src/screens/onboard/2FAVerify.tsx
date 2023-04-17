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

export default function TwoFAVerify({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const login = useUserStore((state) => state.login);


  const secureSave = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  };

  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);
      console.log(tag!.ndefMessage);
      // parse the NDEF message
      const ndefMessage = Ndef.text.decodePayload(new Uint8Array(tag!.ndefMessage[0].payload));
      console.warn('NDEF message', ndefMessage);

      // get privKey from secure store
      const privKey = await SecureStore.getItemAsync("privKey");
      // decrypt the privKey with the random password
      const decryptedPrivKey = await decrypt(ndefMessage, privKey!);
      // verify the decrypted privKey is in the correct format
      if (!ethers.utils.isHexString(decryptedPrivKey)) {
        throw new Error("Invalid private key");
      }



      // login with the decrypted privKey
      login(new ethers.Wallet(decryptedPrivKey!));
      // navigate to the home screen
      navigation.navigate("Wallet");

     
    } catch (ex) {
      console.warn(ex);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest();
    }
  }

  async function generateRandomPassword() {
    // generate a random password of 64 characters
    const randomPassword = Math.random().toString(36).slice(-64);

    // get privKey from secure store
    const privKey = await SecureStore.getItemAsync("privKey");
    // encrypt the privKey with the random password
    const encryptedPrivKey = await encrypt(privKey!, randomPassword);
    // save the encrypted privKey to secure store
    await secureSave("encryptedPrivKey", encryptedPrivKey);
    // save the indicator that the user has a 2FA card
    await secureSave("2faPass", "true");
    return randomPassword;
  }

  readNdef();

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

        {/* <View className="mx-auto mb-8 w-11/12">
          <ActionButton
            text={"I do not have a 2FA card"}
            bold
            rounded
            action={() => {
              navigation.navigate("Wallet");
            }}
          />
        </View> */}
      </View>
    </SafeAreaView>
  );
}
