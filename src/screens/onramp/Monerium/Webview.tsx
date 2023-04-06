import { View, Text, Dimensions, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import ActionButton from "../../../components/ActionButton";
import QueryString from "query-string";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MONERIUM_SETTINGS } from ".";
import { Camera } from "expo-camera";
import useMoneriumStore from "../../../state/monerium";
import useUserStore from "../../../state/user";

type MoneriumWebviewParams = {
  MoneriumWebviewScreen: {
    webWiewUri: string;
    codeVerifier: string;
  };
};

type MoneriumUserData = {
  id: string;
  name: string;
  kyc: {
    outcome: string;
    state: string;
  };
  accounts: {
    address: string;
    chain: string;
    currency: string;
    id: string;
    network: string;
    iban?: string;
    standard?: string;
  }[];
};

export default function MoneriumWebview({ navigation }: { navigation: any }) {
  const { params } =
    useRoute<RouteProp<MoneriumWebviewParams, "MoneriumWebviewScreen">>();

  const { webWiewUri, codeVerifier } = params;
  const windowWidth = Dimensions.get("window").width;

  const { name, iban, update } = useMoneriumStore((state) => ({
    name: state.name,
    iban: state.iban,
    update: state.update,
  }));

  const smartWalletAddress = useUserStore((state) => state.smartWalletAddress);

  const [webViewReturnUrl, setWebViewReturnUrl] = useState<string>("");
  const [returnCode, setReturnCode] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [profile, setProfile] = useState<string>("");

  useEffect(() => {
    if (webViewReturnUrl === "") return;
    const urlParams = new URLSearchParams(webViewReturnUrl);
    const code = urlParams.get("https://m.youtube.com/?code");
    if (!code) return;
    setReturnCode(code);
    getUserData(code);
  }, [webViewReturnUrl]);

  const getUserData = async (code: string) => {
    if (accessToken !== "") return;

    const formData = {
      client_id: MONERIUM_SETTINGS.clientId,
      redirect_uri: "https://www.youtube.com/",
      grant_type: "authorization_code",
      code: code,
      code_verifier: codeVerifier!,
    };

    const response = await fetch(`${MONERIUM_SETTINGS.url}/auth/token`, {
      method: "POST",
      body: QueryString.stringify(formData),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });

    const responseJson = await response.json();
    console.log("responseJson:", responseJson);
    const { access_token, profile } = responseJson;
    setAccessToken(access_token);
    setProfile(profile);

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
    if (!userData.accounts) return;
    const accountWithIban = userData.accounts.find(
      (account) =>
        account.iban &&
        account.address.toLowerCase() ===
          (smartWalletAddress as string).toLowerCase()
    );
    console.log("accountsWithIban :", accountWithIban);

    // right now, puts it in state. TODO: send it to the backend
    update({ name: userData.name, iban: accountWithIban?.iban });
    navigation.navigate("Iban");
  };

  const fetchDataAndOrder = async () => {
    const balances = await fetch(
      `${MONERIUM_SETTINGS.url}/profiles/${profile}/balances`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const balancesJson = await balances.json();
    console.log("user balances", balancesJson[0].balances);

    // let's send some money !
    // const newWallet = new Wallet(
    //   "0x38bb7066dfab8cf4e2005404644c6c022d229e728f2ed8190d67e73c71eab68a"
    // );
    // const date = new Date().toISOString();
    // console.log("date", date);
    // const message = `Send EUR 1000 to GR1601101250000000012300695 at ${date}`;
    // const signature = await newWallet.signMessage(message);

    // const response = await fetch(`${getMoneriumUrl()}/orders`, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     kind: "redeem",
    //     amount: "700",
    //     signature: signature,
    //     address: "0x220e86419ce6217E238b889cBAe9507F263Ec673",
    //     currency: "eur",
    //     // treasuryAccountId: "02a9b1fa-c7e9-11ed-a39d-2a9518932f3d",
    //     counterpart: {
    //       identifier: {
    //         standard: "iban",
    //         iban: "GR16 0110 1250 0000 0001 2300 695",
    //       },
    //       details: {
    //         firstName: "Satoshi",
    //         lastName: "Nakamoto",
    //         country: "FR",
    //       },
    //     },
    //     message: message,
    //     memo: "Let us withdraw",
    //     chain: "polygon",
    //     network: "mumbai",
    //   }),
    //   headers: {
    //     "content-type": "application/json",
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });
    // const json = await response.json();
    // console.log("json", json);
  };

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // const webViewRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // useEffect(() => {
  //   const backAction = () => {
  //     // @ts-ignore
  //     if (webViewRef.current) webViewRef.current.goBack();
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => backHandler.remove();
  // }, []);

  if (hasPermission === null) {
    return <View></View>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera given</Text>;
  }

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <WebView
        style={{ width: windowWidth }}
        source={{ uri: webWiewUri }}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        androidHardwareAccelerationDisabled={true}
        onNavigationStateChange={(webViewState) => {
          setWebViewReturnUrl(webViewState.url);
        }}
        // incognito={true}
      />
    </SafeAreaView>
  );
}
