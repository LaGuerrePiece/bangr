import { View, Text, useColorScheme, SafeAreaView } from "react-native";
import ActionButton from "../../../components/ActionButton";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import useUserStore from "../../../state/user";
import { ethers } from "ethers";
import "react-native-get-random-values";
import useMoneriumStore from "../../../state/monerium";
import { getChain } from "../../../utils/utils";
import { deployWalletsIfNotDeployed } from "../../../utils/signAndRelay";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { toastConfig } from "../../../components/toasts";
import queryString from "query-string";
import { MoneriumUserData } from "./Webview";
import {
  MONERIUM_SECRET_KEY,
  MONERIUM_SECRET_KEY_SANDBOX,
} from "react-native-dotenv";

export const MONERIUM_ENV: any = "prod";

export const MONERIUM_SETTINGS =
  MONERIUM_ENV === "prod"
    ? {
        clientId: "fe7e8ccb-ad2d-11ed-97a8-f2eccd865638",
        clientIdForClientAuth: "fe9b47be-ad2d-11ed-97a8-f2eccd865638",
        url: "https://api.monerium.app",
        secret_key: MONERIUM_SECRET_KEY,
      }
    : {
        clientId: "ca0d8d2a-c2bc-11ed-a453-e6504c27bfa9",
        url: "https://api.monerium.dev",
        secret_key: MONERIUM_SECRET_KEY_SANDBOX,
      };

const oldImplementationAddress = "0xf2b56c7c214b0b4a74e32034c96903b255d698f9";
const newImplementationAddress = "0xaa2d1d0263ee6da02508044bc5fb6d0d784bc8ee";

const MoneriumScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();
  const { smartWalletAddress, wallet } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
    wallet: state.wallet,
  }));
  const { iban, profile, update } = useMoneriumStore((state) => ({
    iban: state.iban,
    profile: state.profile,
    update: state.update,
  }));

  const [codeVerifier, setCodeVerifier] = useState<string>();
  const [webWiewUri, setWebWiewUri] = useState<string>("");
  const [implementationAddress, setImplementationAddress] =
    useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    checkImplementationVersion();
  }, []);

  const checkImplementationVersion = async () => {
    const _IMPLEMENTATION_SLOT =
      "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

    const implementation = await getChain(137).provider.getStorageAt(
      smartWalletAddress as string,
      _IMPLEMENTATION_SLOT
    );

    const implementationAddress = ethers.utils.defaultAbiCoder
      .decode(["address"], implementation)[0]
      .toLowerCase();

    setImplementationAddress(implementationAddress);
  };

  useEffect(() => {
    if (iban) {
      navigation.navigate("Iban");
      return;
    } else if (profile) {
      checkIfKycIsDone();
    } else {
      authenticateAsync();
    }
  }, []);

  const checkIfKycIsDone = async () => {
    const formData = {
      client_id: MONERIUM_SETTINGS.clientIdForClientAuth,
      grant_type: "client_credentials",
      client_secret: MONERIUM_SETTINGS.secret_key,
    };

    const response = await fetch(`${MONERIUM_SETTINGS.url}/auth/token`, {
      method: "POST",
      body: queryString.stringify(formData),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });

    console.log("response", response);

    const { access_token } = await response.json();

    console.log("access_token", access_token);

    const userDataRaw = await fetch(
      `${MONERIUM_SETTINGS.url}/profiles/${profile}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userData: MoneriumUserData = await userDataRaw.json();
    console.log("userData :", userData);
    update({ userData: userData });
    navigation.navigate("Iban");
  };

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
      // address: "0x4ad676Ba57dAd66868392C56F382F9ebA3071dEf", //to test, with ethereum goerli
      address: smartWalletAddress,
      signature: "0x",
      chain: "polygon", // ethereum
      network: "mainnet", // goerli
    };

    const res = await fetch(
      `${MONERIUM_SETTINGS.url}/auth?${new URLSearchParams(params).toString()}`
    );
    console.log("Monerium WebView url :", res.url);

    setCodeVerifier(verifier);
    setWebWiewUri(res.url);
  };

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="p-5">
        <Text className="mt-6 text-center font-InterBold text-[22px] text-typo-light dark:text-typo-dark">
          Add euros from your bank account with our partner Monerium
        </Text>
        <Text className="mt-6 font-InterSemiBold text-base text-typo-light dark:text-typo-dark">
          Monerium allows EU users to convert euros into crypto for a record 0%
          fee. {"\n\n"}
          At the end of the process, Monerium will create a personal IBAN for
          you. Any Euro you deposit into this account will be credited here
          automatically. {"\n\n"}
        </Text>

        {implementationAddress === ethers.constants.AddressZero ? (
          <>
            <Text className="mb-6 font-InterSemiBold text-base text-typo-light dark:text-typo-dark">
              Before continuing, deploy your smart wallet by clicking here
            </Text>
            <ActionButton
              text="Deploy"
              bold
              rounded
              spinner={loading}
              action={async () => {
                setLoading(true);
                Toast.show({
                  type: "info",
                  text1: "Transaction sent",
                  text2: "Waiting for confirmation...",
                });
                await deployWalletsIfNotDeployed(
                  [137],
                  (wallet as ethers.Wallet).address,
                  smartWalletAddress as string
                );
                setLoading(false);
              }}
            />
          </>
        ) : implementationAddress === oldImplementationAddress ? (
          <>
            <Text className="mb-6 font-InterSemiBold text-base text-typo-light dark:text-typo-dark">
              Unfortunately, your smart wallet is not compatible with Monerium
              right now. Please contact us to resolve this.
              {/* Pour upgrade, il faut envoyer du matic sur l'eoa puis call upgradeTo(newImpl) */}
              {/* car on ne supportait pas l'upgrade relayée */}
            </Text>
          </>
        ) : implementationAddress === newImplementationAddress ? null : (
          <Text className="font-InterSemiBold text-base text-typo-light dark:text-typo-dark">
            Your implementation version is unknown.{"\n"}
            If you know what your are doing, go on.
            {/* Smart wallet should be deployed and have signed the Monerium message */}
          </Text>
        )}
      </View>

      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text="Next"
          bold
          rounded
          disabled={
            implementationAddress === ethers.constants.AddressZero ||
            implementationAddress === oldImplementationAddress ||
            !webWiewUri
          }
          action={() =>
            navigation.navigate("MoneriumWebview", {
              webWiewUri,
              codeVerifier,
            })
          }
        />
      </View>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default MoneriumScreen;
