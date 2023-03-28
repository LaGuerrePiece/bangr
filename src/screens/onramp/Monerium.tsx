import {
  View,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  Dimensions,
  Image,
} from "react-native";
import useUserStore from "../../state/user";
import { WebView } from "react-native-webview";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { SafeAreaView } from "react-native-safe-area-context";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { Wallet, ethers } from "ethers";
import ActionButton from "../../components/ActionButton";
import QueryString from "query-string";

const clientId = "ca0d8d2a-c2bc-11ed-a453-e6504c27bfa9";

export default function Monerium() {
  const windowWidth = Dimensions.get("window").width;
  const { smartWalletAddress, userInfo } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
    userInfo: state.userInfo,
    wallet: state.wallet,
  }));

  const [codeVerifier, setCodeVerifier] = useState<string>();
  const [webWiewUri, setWebWiewUri] = useState<string>("");
  const [webViewReturnUrl, setWebViewReturnUrl] = useState<string>("");
  const [returnCode, setReturnCode] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [profile, setProfile] = useState<string>("");

  useEffect(() => {
    authenticateAsync();
  }, []);

  const authenticateAsync = async () => {
    if (codeVerifier) return;

    const wallet = Wallet.createRandom();
    console.log("privateKey", wallet.privateKey);

    if (!wallet) return;
    const verifier = new Array(128).join().replace(/(.|$)/g, function () {
      return ((Math.random() * 36) | 0).toString(36);
    });
    setCodeVerifier(verifier);
    const codeChallenge = CryptoJS.enc.Base64url.stringify(
      CryptoJS.SHA256(verifier)
    );

    console.log("verifier", verifier);
    console.log("codeChallenge", codeChallenge);

    console.log("smartWalletAddress", smartWalletAddress);
    console.log("eoa", wallet.address);
    const signature = await wallet.signMessage(
      "I hereby declare that I am the address owner."
    );

    console.log("signature", signature);

    const params = {
      client_id: clientId,
      redirect_uri: "https://www.youtube.com/",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      // automate the wallet connect step by adding the following optional parameters
      address: wallet.address, // for now, onramp to the EOA for simplicity
      signature: signature,
      // signature:
      //   "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      // signature: "0x",
      chain: "polygon",
      network: "mumbai",
    };

    const res = await fetch(
      `https://api.monerium.dev/auth?${new URLSearchParams(params).toString()}`
    );
    console.log("res.url", res.url);
    setWebWiewUri(res.url);
  };

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
    console.log("code", code);
    console.log("codeVerifier", codeVerifier);

    const formData = {
      client_id: clientId,
      redirect_uri: "https://www.youtube.com/",
      grant_type: "authorization_code",
      code: code,
      code_verifier: codeVerifier!,
    };

    const response = await fetch(`https://api.monerium.dev/auth/token`, {
      method: "POST",
      body: QueryString.stringify(formData),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });

    console.log("response", response.status);
    const json = await response.json();
    console.log("response json", json);
    const { access_token, profile } = json;
    console.log("access_token", access_token);
    console.log("profile", profile);
    setAccessToken(access_token);
    setProfile(profile);
  };

  const fetchDataAndOrder = async () => {
    const response3 = await fetch(
      `https://api.monerium.dev/profiles/${profile}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("response3.json()", await response3.json());

    const balances = await fetch(
      `https://api.monerium.dev/profiles/${profile}/balances`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const balancesJson = await balances.json();
    console.log("balancesJson[0].balances", balancesJson[0].balances);

    // let's send some money !
    const newWallet = new Wallet(
      "0x38bb7066dfab8cf4e2005404644c6c022d229e728f2ed8190d67e73c71eab68a"
    );
    const date = new Date().toISOString();
    console.log("date", date);
    const message = `Send EUR 1000 to GR1601101250000000012300695 at ${date}`;
    const signature = await newWallet.signMessage(message);

    const response = await fetch(`https://api.monerium.dev/orders`, {
      method: "POST",
      body: JSON.stringify({
        kind: "redeem",
        amount: "700",
        signature: signature,
        address: "0x220e86419ce6217E238b889cBAe9507F263Ec673",
        currency: "eur",
        // treasuryAccountId: "02a9b1fa-c7e9-11ed-a39d-2a9518932f3d",
        counterpart: {
          identifier: {
            standard: "iban",
            iban: "GR16 0110 1250 0000 0001 2300 695",
          },
          details: {
            firstName: "Satoshi",
            lastName: "Nakamoto",
            country: "FR",
          },
        },
        message: message,
        memo: "Let us withdraw",
        chain: "polygon",
        network: "mumbai",
      }),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const json = await response.json();
    console.log("json", json);
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      {webWiewUri === "" ? (
        <Text>Loading...</Text>
      ) : returnCode === "" ? (
        <WebView
          style={{ width: windowWidth }}
          source={{ uri: webWiewUri }}
          onNavigationStateChange={(webViewState) => {
            setWebViewReturnUrl(webViewState.url);
          }}
          incognito={true}
        />
      ) : (
        <View>
          <View>
            <Text className="mt-16 text-center font-[InterBold] text-2xl text-typo-light dark:text-typo-dark">
              Great ! It's confirmed
            </Text>
            <Image
              className="mx-auto mt-32 h-56 w-56"
              source={require("../../../assets/figma/globe.png")}
            />
          </View>

          <View className="mx-auto mb-8 w-36 flex-row">
            <ActionButton text="Continue" action={fetchDataAndOrder} />
          </View>
        </View>
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
