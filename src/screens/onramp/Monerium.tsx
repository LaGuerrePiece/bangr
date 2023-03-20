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
import { ethers } from "ethers";

export default function Monerium() {
  const windowWidth = Dimensions.get("window").width;
  const { smartWalletAddress, userInfo } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
    userInfo: state.userInfo,
  }));

  const [codeVerifier, setCodeVerifier] = useState<string>("");
  const [webWiewUri, setWebWiewUri] = useState<string>("");

  const authenticateAsync = async () => {
    if (codeVerifier) return;
    const verifier = ethers.utils.randomBytes(64).toString();
    setCodeVerifier(verifier);
    const codeChallenge = CryptoJS.enc.Base64url.stringify(
      CryptoJS.SHA256(verifier)
    );

    console.log("verifier", verifier);
    console.log("codeChallenge", codeChallenge);

    const params = {
      client_id: "ca0d8d2a-c2bc-11ed-a453-e6504c27bfa9",
      redirect_uri: "https://www.youtube.com/",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      // automate the wallet connect step by adding the following optional parameters
      // address: "0xE6E4b6a802F2e0aeE5676f6010e0AF5C9CDd0a50",
      // signature: "0xVALID_SIGNATURE_2c23962f5a2f189b777b6ecc19a395f446c86aaf3b5d1dc0ba919ddb34372f4c9f0c8686cfc2e8266b3e4d8d1bc7bc67c34a11f9dfe8e691b",
      // chain: "polygon",
      // network: "mumbai",
    };

    const res = await fetch(
      `https://api.monerium.dev/auth?${new URLSearchParams(params).toString()}`
    );
    console.log("res.url", res.url);
    setWebWiewUri(res.url);
  };

  useEffect(() => {
    authenticateAsync();
  }, []);

  // poche://web3auth
  // exp://192.168.1.22:19000/--/web3auth

  return (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      {webWiewUri === "" ? (
        <Text>Loading...</Text>
      ) : (
        <WebView style={{ width: windowWidth }} source={{ uri: webWiewUri }} />
      )}
    </SafeAreaView>
  );
}
