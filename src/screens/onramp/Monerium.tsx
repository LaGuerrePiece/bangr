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
import { TextInput } from "react-native-gesture-handler";
import { colors } from "../../config/configs";
import ActionButton from "../../components/ActionButton";

type UserData = {
  email?: string;
  password?: string;
  country?: string;
  userId?: string;
  emailCode?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
};

export default function Monerium() {
  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get("window").width;
  const { smartWalletAddress, userInfo } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
    userInfo: state.userInfo,
  }));

  const [step, setStep] = useState<string>("welcome");
  const [codeVerifier, setCodeVerifier] = useState<string>("");
  const [codeChallenge, setCodeChallenge] = useState<string>("");
  const [userData, setUserData] = useState<UserData>({});

  useEffect(() => {
    authenticateAsync();
  }, []);

  const authenticateAsync = async () => {
    if (codeVerifier) return;
    const verifier = ethers.utils.randomBytes(64).toString();
    const challenge = CryptoJS.enc.Base64url.stringify(
      CryptoJS.SHA256(verifier)
    );
    setCodeVerifier(verifier);
    setCodeChallenge(challenge);

    console.log("verifier", verifier);
    console.log("challenge", challenge);

    const params = {
      client_id: "fe7e8ccb-ad2d-11ed-97a8-f2eccd865638",
      redirect_uri: "https://www.youtube.com/",
      code_challenge: challenge,
      code_challenge_method: "S256",
      // automate the wallet connect step by adding the following optional parameters
      // address: "0xE6E4b6a802F2e0aeE5676f6010e0AF5C9CDd0a50",
      // signature: "0xVALID_SIGNATURE_2c23962f5a2f189b777b6ecc19a395f446c86aaf3b5d1dc0ba919ddb34372f4c9f0c8686cfc2e8266b3e4d8d1bc7bc67c34a11f9dfe8e691b",
      // chain: "polygon",
      // network: "mumbai",
    };

    const res = await fetch(
      `https://api.monerium.app/auth?${new URLSearchParams(params).toString()}`
    );
    console.log("res.url", res.url);

    // https://monerium.app/partners/012bd5f8-ad2e-11ed-97a8-f2eccd865638/auth?redirect_uri=https%3A%2F%2Fwww.youtube.com%2F%26code_challenge%3DSnwHNPP8EI2XfLDGlxfWsJvvCaSWDcZsFDvHANh0mCo%26code_challenge_method%3DS256%26partner%3D012bd5f8-ad2e-11ed-97a8-f2eccd865638&token=MDI4MDY5
  };

  const addFirstDetails = async () => {
    const resAfterFirstScreen = await fetch(
      `https://monerium.app/api/iam/signup`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.email,
          email: userData.email,
          password: userData.password,
          terms: true,
          privacy: true,
          country: userData.country,
          redirectUri: `https://www.youtube.com/&code_challenge=${codeChallenge}&code_challenge_method=S256&partner=012bd5f8-ad2e-11ed-97a8-f2eccd865638`,
          partner: "012bd5f8-ad2e-11ed-97a8-f2eccd865638",
        }),
      }
    );
    const json = await resAfterFirstScreen.json();
    console.log("resAfterFirstScreen json", json);
    setUserData({
      ...userData,
      userId: json.userId,
    });
  };

  const verifyEmailCode = async () => {
    const wordArray = CryptoJS.enc.Utf8.parse(userData.emailCode!);
    const base64String = wordArray.toString(CryptoJS.enc.Base64);
    console.log("base64String", base64String);

    const resAfterEmailCode = await fetch(
      `https://monerium.app/api/iam/confirm/${base64String}}`
    );
    const json = await resAfterEmailCode.json();
    if (json.auth.verified) {
      console.log("success");
    }
  };

  // poche://web3auth
  // exp://192.168.1.22:19000/--/web3auth

  return step === "welcome" ? (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto mt-6 w-64 rounded-xl border-2 bg-primary-light p-1 dark:bg-primary-dark">
        <TextInput
          style={{
            color:
              colorScheme === "light" ? colors.typo.light : colors.typo.dark,
          }}
          placeholderTextColor={colors.typo2.light}
          className="my-1 text-lg font-semibold text-typo-light dark:text-typo-dark"
          onChangeText={(value) =>
            setUserData({
              ...userData,
              email: value,
            })
          }
          value={userData.email}
          placeholder="Your email"
        />
      </View>
      <View className="mx-auto mt-6 w-64 rounded-xl border-2 bg-primary-light p-1 dark:bg-primary-dark">
        <TextInput
          style={{
            color:
              colorScheme === "light" ? colors.typo.light : colors.typo.dark,
          }}
          placeholderTextColor={colors.typo2.light}
          className="my-1 text-lg font-semibold text-typo-light dark:text-typo-dark"
          onChangeText={(value) =>
            setUserData({
              ...userData,
              password: value,
            })
          }
          value={userData.password}
          placeholder="Your password"
        />
      </View>
      <View className="mx-auto mt-6 w-64 rounded-xl border-2 bg-primary-light p-1 dark:bg-primary-dark">
        <TextInput
          style={{
            color:
              colorScheme === "light" ? colors.typo.light : colors.typo.dark,
          }}
          placeholderTextColor={colors.typo2.light}
          className="my-1 text-lg font-semibold text-typo-light dark:text-typo-dark"
          onChangeText={(value) =>
            setUserData({
              ...userData,
              country: value,
            })
          }
          value={userData.country}
          placeholder="Your country (FR for France)"
        />
      </View>
      <ActionButton
        text="Next"
        action={() => {
          addFirstDetails();
          setStep("second");
        }}
      />
    </SafeAreaView>
  ) : step === "second" ? (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      <Text className="mt-6 text-center text-2xl font-bold">
        Sent you an email ! Code ? :
      </Text>
      <View className="mx-auto mt-6 w-64 rounded-xl border-2 bg-primary-light p-1 dark:bg-primary-dark">
        <TextInput
          style={{
            color:
              colorScheme === "light" ? colors.typo.light : colors.typo.dark,
          }}
          placeholderTextColor={colors.typo2.light}
          className="my-1 text-lg font-semibold text-typo-light dark:text-typo-dark"
          onChangeText={(value) =>
            setUserData({
              ...userData,
              emailCode: value,
            })
          }
          value={userData.emailCode}
          placeholder="6 digits code"
        />
      </View>
      <ActionButton
        text="Next"
        action={() => {
          verifyEmailCode();
          setStep("third");
        }}
      />
    </SafeAreaView>
  ) : step === "third" ? (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      <Text className="mt-6 text-center text-2xl font-bold">Third</Text>
    </SafeAreaView>
  ) : null;
}
