import {
  View,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { colors } from "../config/configs";
import useUserStore from "../state/user";
import { WebView } from "react-native-webview";
// @ts-ignore
import TransakWebView from "@transak/react-native-sdk";
import { useState } from "react";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { TouchableOpacity } from "react-native";
import { toastConfig } from "../components/toasts";

const OnrampScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get("window").width;
  const { smartWalletAddress, userInfo } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
    userInfo: state.userInfo,
  }));
  const [onRamp, setOnRamp] = useState("");

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

  const RampOption = ({
    logo,
    text,
    action,
  }: {
    logo: number;
    text: string;
    action: any;
  }) => {
    return (
      <TouchableOpacity className="my-2 w-11/12" onPress={action}>
        <View className="flex items-center rounded-xl bg-secondary-light p-4 text-xl dark:bg-secondary-dark">
          <Image className="h-16 w-64" source={logo} />
          {/* <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
          {text}
        </Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="h-full items-center bg-primary-light py-6 dark:bg-primary-dark">
      <TouchableWithoutFeedback onPress={navigation.goBack}>
        <View className="mx-auto w-11/12">
          <XMarkIcon
            size={36}
            color={
              colorScheme === "light" ? colors.typo.light : colors.typo.dark
            }
          />
        </View>
      </TouchableWithoutFeedback>
      <Text className="m-2 text-2xl font-bold text-typo-light dark:text-typo-dark">
        Add money to Bangr !
      </Text>
      {onRamp === "" ? (
        <View className="flex w-full items-center">
          <RampOption
            logo={require("../../assets/transak.png")}
            text={""}
            action={() => setOnRamp("transak")}
          />
          <RampOption
            logo={require("../../assets/bangramp.png")}
            text={""}
            action={() => setOnRamp("bangramp")}
          />
          <RampOption
            logo={
              colorScheme === "dark"
                ? require("../../assets/mtpelerin_dark.png")
                : require("../../assets/mtpelerin.png")
            }
            text={""}
            action={() => {
              Toast.show({
                type: "info",
                text1: "Coming soon",
                text2: "Stay tuned!",
              });
            }}
          />
        </View>
      ) : onRamp === "transak" ? (
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
      ) : onRamp === "bangramp" ? (
        <WebView
          style={{ width: windowWidth }}
          source={{ uri: "https://onramp.vercel.app" }}
        />
      ) : (
        <View></View>
      )}
      <Toast config={toastConfig} />
    </View>
  );
};

export default OnrampScreen;
