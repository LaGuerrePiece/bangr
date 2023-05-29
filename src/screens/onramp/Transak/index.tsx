import { Dimensions } from "react-native";
import useUserStore from "../../../state/user";
// @ts-ignore
import TransakWebView from "@transak/react-native-sdk";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebViewNavigation } from "react-native-webview";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { toastConfig } from "../../../components/toasts";
import { t } from "i18next";
import { RootStackParamList } from "../../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

export default function Transak({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Transak">) {
  const windowWidth = Dimensions.get("window").width;
  const { smartWalletAddress } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
  }));
  const { t } = useTranslation();

  const transakEventHandler = (event: string, data: any) => {
    switch (event) {
      case "ORDER_PROCESSING":
        console.log(data);
        Toast.show({
          type: "info",
          text1: t("orderProcessing") as string,
          text2: t("yourOrderShouldArriveSoon") as string,
        });
        break;

      case "ORDER_COMPLETED":
        console.log(data);
        Toast.show({
          type: "success",
          text1: t("orderConfirmed") as string,
          text2: t("orderReceived") as string,
        });
        break;

      default:
        console.log(data);
    }
  };

  console.log("Transak screen :", {
    fiatAmount: route.params?.fiatAmount,
    cryptoCurrencyCode: route.params?.cryptoCurrencyCode,
    paymentMethod: route.params?.paymentMethod,
  });

  return (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      <TransakWebView
        queryParams={{
          apiKey: "c99e44a4-8c0e-4831-952d-2edc91cd0bc9",
          // apiKey: "64265438-8e6b-4784-9de4-c9164e92be2a",
          environment: "PRODUCTION",
          // environment: "STAGING",
          networks: "polygon,optimism,arbitrum",
          // defaultNetwork: "polygon",
          // defaultCryptoCurrency: "USDC",
          // cryptoCurrencyList: "USDC,DAI,USDT,ETH,WBTC,MATIC,AGEUR,WETH",
          walletAddress: smartWalletAddress,
          // defaultFiatAmount: "100",
          exchangeScreenTitle: t("transakScreenTitle"),
          disableWalletAddressForm: true,
          isDisableCrypto: true,
          redirectURL: "https://www.google.com/",
          // themeColor: "000000",
          productsAvailed: "BUY",

          // fiatAmount: "100",
          fiatCurrency: "EUR",
          fiatAmount: route.params?.fiatAmount,
          cryptoCurrencyCode: route.params?.cryptoCurrencyCode,
          defaultPaymentMethod:
            route.params?.paymentMethod === "card"
              ? "credit_debit_card"
              : "sepa_bank_transfer",

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
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
}
