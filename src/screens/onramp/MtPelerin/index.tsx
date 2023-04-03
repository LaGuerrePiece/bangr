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

const oldImplementationAddress = "0xf2b56c7c214b0b4a74e32034c96903b255d698f9";
const newImplementationAddress = "...";

const MoneriumScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();
  const { smartWalletAddress, wallet } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
    wallet: state.wallet,
  }));

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

        {implementationAddress === ethers.constants.AddressZero ? (
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
              }}
            />
          </>
        ) : implementationAddress === oldImplementationAddress ? (
          <>
            <Text className="mb-6 font-[InterSemiBold] text-base text-typo-light dark:text-typo-dark">
              Unfortunately, your smart wallet is not compatible with Monerium
              right now. Please contact us to resolve this.
              {/* Pour upgrade, il faut envoyer du matic sur l'eoa puis call upgradeTo(newImpl) */}
              {/* car on ne supportait pas l'upgrade relayée */}
            </Text>

            {/* <ActionButton
              text="Update"
              bold
              rounded
              action={() => {
                setLoading(true);
                Toast.show({
                  type: "info",
                  text1: "Transaction sent",
                  text2: "Waiting for confirmation...",
                });
                // update implementation
                setLoading(false);
              }}
            /> */}
          </>
        ) : implementationAddress === newImplementationAddress ? null : (
          <Text className="font-[InterSemiBold] text-base text-typo-light dark:text-typo-dark">
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
          disabled={implementationAddress === oldImplementationAddress}
          action={() => navigation.navigate("MoneriumWebview")}
        />
      </View>
    </SafeAreaView>
  );
};

export default MoneriumScreen;
