import {
  View,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  Dimensions,
  Image,
  ActivityIndicator,
  StyleSheet,
  BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { Wallet, ethers } from "ethers";
import ActionButton from "../../../components/ActionButton";
import QueryString from "query-string";
import { RouteProp, useRoute } from "@react-navigation/native";
import useUserStore from "../../../state/user";
import { MONERIUM_CLIENT_ID, getMoneriumUrl } from ".";
import { Camera } from "expo-camera";

type MoneriumWebviewParams = {
  MoneriumWebviewScreen: {
    webWiewUri: string;
    codeVerifier: string;
  };
};

export default function MoneriumWebview({ navigation }: { navigation: any }) {
  const { params } =
    useRoute<RouteProp<MoneriumWebviewParams, "MoneriumWebviewScreen">>();

  const { webWiewUri, codeVerifier } = params;
  const windowWidth = Dimensions.get("window").width;

  const { name, iban, update } = useUserStore((state) => ({
    name: state.name,
    iban: state.iban,
    update: state.update,
  }));

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
      client_id: MONERIUM_CLIENT_ID,
      redirect_uri: "https://www.youtube.com/",
      grant_type: "authorization_code",
      code: code,
      code_verifier: codeVerifier!,
    };

    const response = await fetch(`${getMoneriumUrl()}/auth/token`, {
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

    const userDataRaw = await fetch(`${getMoneriumUrl()}/profiles/${profile}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    const userData = await userDataRaw.json();
    console.log("userData :", userData);
    if (!userData.accounts) return;
    const accountWithIban = userData.accounts.find(
      (account: any) => account.iban
    );
    // right now, puts it in state. Later: send it to the backend
    update({ name: userData.name, iban: accountWithIban.iban });
  };

  const fetchDataAndOrder = async () => {
    const balances = await fetch(
      `${getMoneriumUrl()}/profiles/${profile}/balances`,
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
    return <Text>Waiting for access</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera given</Text>;
  }

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      {returnCode === "" ? (
        <WebView
          style={{ width: windowWidth }}
          source={{ uri: webWiewUri }}
          onNavigationStateChange={(webViewState) => {
            setWebViewReturnUrl(webViewState.url);
          }}
          // incognito={true}
        />
      ) : (
        <>
          <View>
            <Text className="my-12 text-center font-[InterBold] text-2xl text-typo-light dark:text-typo-dark">
              Great ! Account created.
            </Text>

            <Text className="mx-auto my-5 font-[Inter] text-base text-typo-light dark:text-typo-dark">
              You can now use these details to fund your account :
            </Text>

            <View className="mx-auto my-2 w-11/12 rounded-md bg-secondary-light p-2 dark:bg-secondary-dark">
              <Text className="font-[Inter] text-typo-light dark:text-typo-dark">
                Beneficiary
              </Text>
              <Text className="font-[InterMedium] text-lg text-typo-light dark:text-typo-dark">
                {name}
              </Text>
            </View>

            <View className="mx-auto my-2 w-11/12 rounded-md bg-secondary-light p-2 dark:bg-secondary-dark">
              <Text className="font-[Inter] text-typo-light dark:text-typo-dark">
                IBAN
              </Text>
              <Text className="font-[InterMedium] text-lg text-typo-light dark:text-typo-dark">
                {iban}
              </Text>
            </View>

            <View className="mx-auto my-2 w-11/12 rounded-md bg-secondary-light p-2 dark:bg-secondary-dark">
              <Text className="font-[Inter] text-typo-light dark:text-typo-dark">
                BIC
              </Text>
              <Text className="font-[InterMedium] text-lg text-typo-light dark:text-typo-dark">
                EAPFESM2XXX
              </Text>
            </View>

            <Text className="mx-auto my-5 font-[Inter] text-base text-typo-light dark:text-typo-dark">
              When the funds are received, euros will be credited instantly to
              your account.
            </Text>
          </View>

          <View className="mx-auto mb-8 flex-row">
            <ActionButton
              text="Back to Home"
              rounded
              action={() => navigation.navigate("Wallet")}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

// curl --location --request POST 'https://api.monerium.dev/auth/token' \
//  --header 'Content-Type: application/x-www-form-urlencoded' \
//  --data-urlencode 'grant_type=authorization_code' \
//  --data-urlencode 'client_id=ca0d8d2a-c2bc-11ed-a453-e6504c27bfa9' \
//  --data-urlencode 'code=r99_ukmyRuaJgWoJ-Q6yFg' \
//  --data-urlencode 'code_verifier=z81y68jal7h81628fc049m3aia5f3sr2etc9bwj0q5unu43gkag5il167679bwm5p8guu4m6e2wn731bseloflkk1kgwlm9hy6gzgu95ybw8toxzh950z6qu9v416jha' \
//  --data-urlencode 'redirect_uri=https://www.youtube.com/'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c4154",
    paddingTop: 20,
  },
  activityContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
  },
  view: {
    borderColor: "red",
  },
});
