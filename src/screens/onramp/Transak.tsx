import { View, Text, useColorScheme, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useUserStore from "../../state/user";
// @ts-ignore
import TransakWebView from "@transak/react-native-sdk";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Transak() {
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

{
  /* <WebView
  style={{ width: windowWidth }}
  source={{ uri: "https://onramp.vercel.app" }}
/> */
}
