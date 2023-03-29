import { View, Text, useColorScheme, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useUserStore from "../../state/user";
// @ts-ignore
import TransakWebView from "@transak/react-native-sdk";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebViewNavigation } from "react-native-webview";

export default function Transak({ navigation }: { navigation: any }) {
  const windowWidth = Dimensions.get("window").width;
  const { smartWalletAddress } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
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
          // apiKey: "64265438-8e6b-4784-9de4-c9164e92be2a",
          environment: "PRODUCTION",
          // environment: "STAGING",
          networks: "polygon,optimism,arbitrum",
          defaultNetwork: "polygon",
          defaultCryptoCurrency: "USDC",
          cryptoCurrencyList: "USDC,DAI,USDT,ETH,WBTC,MATIC,AGEUR,WETH",
          walletAddress: smartWalletAddress,
          defaultFiatAmount: "100",
          exchangeScreenTitle: "Add money to Bangr !",
          disableWalletAddressForm: true,
          isDisableCrypto: true,
          redirectURL: "https://www.youtube.com/",
          // themeColor: "000000",

          // possible de faire un form custom et de passer toutes les infos:

          // email: userInfo?.email,
          // userData: encodeURIComponent(JSON.stringify({
          //   "firstName": "Satoshi",
          //   "lastName": "Nakamoto",
          //   "email": "satoshi.nakamoto@transak.com",
          //   "mobileNumber": "+15417543010",
          //   "dob": "1994-08-26",
          //   "address": {
          //     "addressLine1": "170 Pine St",
          //     "addressLine2": "San Francisco",
          //     "city": "San Francisco",
          //     "state": "CA",
          //     "postCode": "94111",
          //     "countryCode": "US"
          //   }
          // }))
        }}
        onTransakEventHandler={transakEventHandler}
        style={{ width: windowWidth }}
        onNavigationStateChange={(webViewState: WebViewNavigation) => {
          if (webViewState.url.includes("transak")) return;
          if (webViewState.url.includes("youtube")) {
            const urlParams = new URLSearchParams(webViewState.url);
            navigation.navigate("OrderConfirmed");
          }
        }}
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
