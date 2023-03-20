import {
  View,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../config/configs";
import useUserStore from "../../state/user";
import { WebView } from "react-native-webview";
// @ts-ignore
import TransakWebView from "@transak/react-native-sdk";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Monerium() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get("window").width;
  const { smartWalletAddress, userInfo } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
    userInfo: state.userInfo,
  }));

  const transakEventHandler = (event: string, data: any) => {
    switch (event) {
      case "ORDER_PROCESSING":
        console.log(data);
        break;

      case "ORDER_COMPLETED":
        console.log(data);
        break;

      default:
        console.log(data);
    }
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      <TransakWebView
        queryParams={{
          apiKey: "c99e44a4-8c0e-4831-952d-2edc91cd0bc9",
          environment: "PRODUCTION",
          networks: "polygon,optimism,arbitrum",
          defaultNetwork: "polygon",
          defaultCryptoCurrency: "USDC",
          cryptoCurrencyList: "USDC,DAI,USDT,ETH,WBTC,MATIC,AGEUR,WETH",
          walletAddress: smartWalletAddress,
          email: userInfo?.email,
          // exchangeScreenTitle: "Add money to Bangr !",
          // disableWalletAddressForm: true,
          // redirectURL
          // fiatCurrency: "USD",
        }}
        onTransakEventHandler={transakEventHandler}
        style={{ width: windowWidth }}
        // onLoadStart={}    // react-native-webview prop
        // onLoadEnd={}      // react-native-webview prop
      />
    </SafeAreaView>
  );
}
