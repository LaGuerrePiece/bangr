import { View, Text, useColorScheme, Image, SafeAreaView } from "react-native";
import ActionButton from "../../../components/ActionButton";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import useUserStore from "../../../state/user";
import { ethers } from "ethers";
import "react-native-get-random-values";

// export const MONERIUM_CLIENT_ID = "ca0d8d2a-c2bc-11ed-a453-e6504c27bfa9";
export const MONERIUM_CLIENT_ID = "fe7e8ccb-ad2d-11ed-97a8-f2eccd865638";
export const MONERIUM_ENV = "prod";

export function getMoneriumUrl() {
  if (MONERIUM_ENV === "prod") {
    return "https://api.monerium.app";
  } else {
    return "https://api.monerium.dev";
  }
}

const MoneriumScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();
  const { smartWalletAddress } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
    wallet: state.wallet,
  }));
  const { name, iban } = useUserStore((state) => ({
    name: state.name,
    iban: state.iban,
  }));

  const [codeVerifier, setCodeVerifier] = useState<string>();
  const [webWiewUri, setWebWiewUri] = useState<string>("");

  useEffect(() => {
    if (iban) return;
    authenticateAsync();
  }, []);

  const authenticateAsync = async () => {
    if (codeVerifier) return;

    const privateKeyBytes = new Uint8Array(32);
    crypto.getRandomValues(privateKeyBytes);
    const privateKey = Buffer.from(privateKeyBytes);
    const wallet = new ethers.Wallet(privateKey);

    const verifier = new Array(128).join().replace(/(.|$)/g, function () {
      return ((Math.random() * 36) | 0).toString(36);
    });

    const codeChallenge = CryptoJS.enc.Base64url.stringify(
      CryptoJS.SHA256(verifier)
    );
    const signature = await wallet.signMessage(
      "I hereby declare that I am the address owner."
    );

    console.log("privateKey", wallet.privateKey);
    console.log("verifier", verifier);
    console.log("codeChallenge", codeChallenge);
    console.log("smartWalletAddress", smartWalletAddress);
    console.log("eoa", wallet.address);
    console.log("signature", signature);

    const params = {
      client_id: MONERIUM_CLIENT_ID,
      redirect_uri: "https://www.youtube.com/",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      // automate the wallet connect step by adding the following optional parameters. If user connects with existing account, it's disgarded, which is a big fucking problem
      address: wallet.address, // for now, onramp to the EOA for simplicity
      signature: signature,
      // signature:
      //   "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      // signature: "0x",
      chain: "polygon",
      network: "mumbai",
    };

    const res = await fetch(
      `${getMoneriumUrl()}/auth?${new URLSearchParams(params).toString()}`
    );
    console.log("res.url", res.url);

    setCodeVerifier(verifier);
    setWebWiewUri(res.url);
  };

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="p-8">
        <Text className="mt-2 mr-4 font-[InterBold] text-[22px] leading-9 text-typo-light dark:text-typo-dark">
          Add euros from your bank account with our partner Monerium
        </Text>
        <Text className="ml-1 mt-1 font-[InterSemiBold] text-base text-typo-light dark:text-typo-dark">
          For a record 0% fee
        </Text>
      </View>

      {iban ? (
        <>
          <View>
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
      ) : (
        <View>
          <View className="mx-auto mb-8 w-11/12">
            <ActionButton
              text="Add eur"
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

          <Text className="p-2 text-center font-[Inter] text-[15px] text-typo-light dark:text-typo-dark">
            Already have a Monerium account ?{" "}
            <Text
              className="text-blue-500 underline"
              onPress={() => {
                navigation.navigate("MoneriumWebview");
              }}
            >
              Sign in here
            </Text>
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MoneriumScreen;
