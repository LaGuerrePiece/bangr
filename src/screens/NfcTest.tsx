import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Appearance,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import RNPickerSelect from "react-native-picker-select";

import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';


NfcManager.start();

const NfcTest = () => {
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
     

      
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <SafeAreaView className="h-full bg-secondary-light dark:bg-primary-dark">

        <Text className="text-2xl font-bold text-typo-light dark:text-typo-dark">
          Settings
        </Text>

        <View>
      <TouchableOpacity onPress={readNdef}>
        <Text>Scan a Tag</Text>
      </TouchableOpacity>
    </View>

    </SafeAreaView>
  );
};

export default NfcTest;
