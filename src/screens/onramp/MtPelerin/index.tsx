import { View, Text, useColorScheme, Image, SafeAreaView } from "react-native";
import ActionButton from "../../../components/ActionButton";
import { useEffect, useState } from "react";
import useUserStore from "../../../state/user";
import { ethers } from "ethers";
import "react-native-get-random-values";
import { getChain } from "../../../utils/utils";
import walletLogicABI from "../../../config/abi/WalletLogic.json";
import { deployWalletsIfNotDeployed } from "../../../utils/signAndRelay";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const newABI = [
  ...walletLogicABI,
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    name: "signedMessages",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const getMtPelerinHashAndCode = (smartWalletAddress: string) => {
  let decimalAddress = ethers.BigNumber.from(smartWalletAddress as string).mod(
    10000
  );

  if (Number(decimalAddress.toString()) < 1000) {
    decimalAddress = ethers.BigNumber.from("0").add(1000).add(decimalAddress);
  }

  console.log("code: ", decimalAddress.toString());

  const code = decimalAddress.toString();
  const message = "MtPelerin-" + code;
  const hash = ethers.utils.hashMessage(message);

  console.log("hash", hash);

  const base64Hash = Buffer.from(hash.replace("0x", ""), "hex").toString(
    "base64"
  );

  return {
    code,
    hash,
    base64Hash,
  };
};

const MoneriumScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();
  const { smartWalletAddress, wallet } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
    wallet: state.wallet,
  }));

  const [walletDeployed, setWalletDeployed] = useState<boolean>(true);
  const [supportsMtPelerin, setSupportsMtPelerin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    checkWalletSupportsMtPelerin();
  }, []);

  const checkWalletSupportsMtPelerin = async () => {
    const code = await getChain(137).provider.getCode(
      smartWalletAddress as string
    );

    if (code === "0x") {
      setWalletDeployed(false);
      return;
    }

    const smartWallet = new ethers.Contract(
      smartWalletAddress as string,
      newABI,
      getChain(137).provider
    );

    const hash = getMtPelerinHashAndCode(smartWalletAddress as string).hash;

    try {
      const supports = await smartWallet.signedMessages(hash);

      console.log("supports", supports);
      if (supports) setSupportsMtPelerin(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="p-5">
        <Text className="mt-6 text-center font-[InterBold] text-[22px] text-typo-light dark:text-typo-dark">
          Add euros from your bank account or your card with our partner
          MtPelerin
        </Text>
        <Text className="mt-6 font-[InterSemiBold] text-base text-typo-light dark:text-typo-dark">
          The first 500 euros by bank transfer have a 0% fee {"\n\n"}
          You will have to verify your identity, otherwise your funds will only
          be delivered after a 7-days withholding period.{"\n\n"}
        </Text>

        {!walletDeployed ? (
          <>
            <Text className="mb-6 font-[InterSemiBold] text-base text-typo-light dark:text-typo-dark">
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
                setWalletDeployed(true);
                setSupportsMtPelerin(true); // new ones do
              }}
            />
          </>
        ) : !supportsMtPelerin ? (
          <>
            <Text className="mb-6 font-[InterSemiBold] text-base text-typo-light dark:text-typo-dark">
              Unfortunately, your smart wallet is not compatible with MtPelerin
              right now. Please contact us to resolve this.
              {/* Pour upgrade, il faut envoyer du matic sur l'eoa puis call upgradeTo(newImpl) */}
              {/* car on ne supportait pas l'upgrade relayée */}
            </Text>
          </>
        ) : null}
      </View>

      <View className="mx-auto mb-8 w-11/12">
        <ActionButton
          text="Next"
          bold
          rounded
          disabled={!supportsMtPelerin}
          action={() => navigation.navigate("MtPelerinWebview")}
        />
      </View>
    </SafeAreaView>
  );
};

export default MoneriumScreen;
