import { View, Text, useColorScheme, Image, SafeAreaView } from "react-native";
import ActionButton from "../../../components/ActionButton";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import useUserStore from "../../../state/user";
import { ethers } from "ethers";
import "react-native-get-random-values";
import useMoneriumStore from "../../../state/monerium";

export const MONERIUM_ENV: any = "test";

export const MONERIUM_SETTINGS =
  MONERIUM_ENV === "prod"
    ? {
        clientId: "fe7e8ccb-ad2d-11ed-97a8-f2eccd865638",
        url: "https://api.monerium.app",
      }
    : {
        clientId: "ca0d8d2a-c2bc-11ed-a453-e6504c27bfa9",
        url: "https://api.monerium.dev",
      };

const MoneriumScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();
  const { smartWalletAddress } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
  }));
  const { iban } = useMoneriumStore((state) => ({
    iban: state.iban,
  }));

  const [codeVerifier, setCodeVerifier] = useState<string>();
  const [webWiewUri, setWebWiewUri] = useState<string>("");

  useEffect(() => {
    if (iban) {
      navigation.navigate("Iban");
      return;
    } else {
      authenticateAsync();
    }
  }, []);

  const authenticateAsync = async () => {
    if (codeVerifier || !smartWalletAddress) return;

    const verifier = new Array(128).join().replace(/(.|$)/g, function () {
      return ((Math.random() * 36) | 0).toString(36);
    });

    const codeChallenge = CryptoJS.enc.Base64url.stringify(
      CryptoJS.SHA256(verifier)
    );

    console.log("verifier", verifier);
    console.log("codeChallenge", codeChallenge);
    console.log("smartWalletAddress", smartWalletAddress);

    const params = {
      client_id: MONERIUM_SETTINGS.clientId,
      redirect_uri: "https://www.youtube.com/",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      // automate the wallet connect step by adding the following optional parameters.
      //If user connects with existing account, it's disgarded, which is a big fucking problem
      address: smartWalletAddress,
      signature: "0x",
      chain: "polygon",
      network: "mainnet",
    };

    const res = await fetch(
      `${MONERIUM_SETTINGS.url}/auth?${new URLSearchParams(params).toString()}`
    );
    console.log("res.url", res.url);

    setCodeVerifier(verifier);
    setWebWiewUri(res.url);
  };

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="p-4">
        <Text className="mx-auto mt-6 text-center font-[InterBold] text-[22px] text-typo-light dark:text-typo-dark">
          Add euros from your bank account with our partner Monerium
        </Text>
        <Text className="mx-auto mt-6 font-[InterSemiBold] text-base text-typo-light dark:text-typo-dark">
          Monerium allows EU users to convert euros into crypto for a record 0%
          fee. {"\n\n"}
          At the end of the process, Monerium will create a personal IBAN for
          you. Any Euro you deposit into this account will be credited here
          automatically. {"\n\n"}
        </Text>
      </View>

      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text="Next"
          bold
          rounded
          disabled={!webWiewUri}
          action={() =>
            navigation.navigate("MoneriumWebview", {
              webWiewUri,
              codeVerifier,
            })
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default MoneriumScreen;
