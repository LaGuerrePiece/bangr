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
      console.warn("Tag found", tag);
      // parse the NDEF message composed of 6 records
      let ndefMessage = "";
      for (let i = 0; i < 6; i++) {
        ndefMessage += Ndef.text.decodePayload(
          new Uint8Array(tag!.ndefMessage[i].payload)
        );
      }
      console.warn("NDEF message", ndefMessage);
      console.log(ndefMessage.length);
      // if the NDEF message is not empty, and is 72 characters long, then it is a valid 2FA card
      if (ndefMessage.length === 72) {
        // get the privKey from the secure store
        const privKey = await SecureStore.getItemAsync("privKey");
        console.log("privKey", privKey);
        // decrypt the privKey
        const decryptedPrivKey = await decrypt(privKey!, ndefMessage);
        console.log("decrypted", decryptedPrivKey);
        // if the decrypted privKey is a valid private key, then login with it
        if (ethers.utils.isHexString(decryptedPrivKey)) {
          login(new ethers.Wallet(decryptedPrivKey));
          navigation.navigate("Wallet");
        }
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest();
    }
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
          <View className="flex-row justify-center items-center">
            <Image
              className="mx-auto mt-8 w-[300px] h-[200px]"
              source={require("../../../assets/2facard.png")}
            />
          </View>
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
