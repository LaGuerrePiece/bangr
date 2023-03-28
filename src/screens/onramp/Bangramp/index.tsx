import {
  View,
  Text,
  useColorScheme,
  Dimensions,
  Image,
  TouchableHighlight,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButton from "../../../components/ActionButton";
import { TextInput } from "react-native-gesture-handler";
import { colors } from "../../../config/configs";
import { useEffect, useState } from "react";
import WebView from "react-native-webview";
const windowWidth = Dimensions.get("window").width;
import WertWidget from "@wert-io/widget-initializer";

export default function Bangramp({ navigation }: { navigation: any }) {
  const [amountIn, setAmountIn] = useState<string>("50");
  const [showWebview, setShowWebview] = useState<boolean>(false);

  const exchangeRate = 0.98;

  const wertWidget = new WertWidget();
  console.log("wertWidget", wertWidget);

  // const params = {
  //   apiKey: "pk_live_q9RGNNxVw8kvQF87xk9SgL5ZwAfT4O5h",
  //   currencyCode: "usdc", //put polygon here
  //   walletAddress: "0x9D392187c08fc28A86e1354aD63C70897165b982", //il faut signer pour que ça marche
  //   colorCode: "#0000FF",
  //   theme: "dark",
  //   email: "f@poche.fi",
  //   baseCurrencyCode: "eur",
  //   baseCurrencyAmount: "30",
  //   paymentMethod: "credit_debit_card",
  //   redirectURL: "bangr://",
  // };

  const params = {
    partner_id: "default",
    currency_amount: "30",
    commodity: "USDC:polygon",
    address: "0x9D392187c08fc28A86e1354aD63C70897165b982",
    redirect_url: "bangr://",
    phone: "+33644621318",
    email: "i@poche.fi",
    lang: "fr",
  };

  const url = `https://widget.wert.io?${new URLSearchParams(
    params
  ).toString()}`;
  console.log("url", url);

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      {showWebview ? (
        <WebView
          style={{ width: windowWidth }}
          source={{
            uri: url,
          }}
          incognito={true}
        />
      ) : (
        <>
          <View>
            <View className="p-8">
              <Text className="mt-2 mr-4 text-center font-[InterBold] text-[22px] leading-9 text-typo-light dark:text-typo-dark">
                Add your first bucks to Bangr
              </Text>
            </View>

            <View className="mx-auto h-20 w-11/12 flex-row items-center justify-between rounded-xl bg-secondary-light dark:bg-secondary-dark">
              <View className="m-3 pt-1">
                <Text className="text-typo-light dark:text-typo-dark">
                  You pay
                </Text>
                <TextInput
                  placeholderTextColor={colors.typo2.light}
                  className="w-48 text-4xl font-semibold text-typo-light dark:text-typo-dark"
                  onChangeText={(text: string) => {
                    setAmountIn(text);
                  }}
                  value={amountIn.toString()}
                  keyboardType="numeric"
                  placeholder="50"
                />
              </View>

              <View
                className="h-full w-24 flex-row items-center justify-center rounded-tr-xl rounded-br-xl bg-secondary-light p-2
            dark:bg-tertiary-dark"
              >
                <Image
                  className="mr-2 h-8 w-8 rounded-full"
                  source={require("../../../../assets/eu-flag.jpg")}
                />
                <Text className="text-lg font-bold text-typo-light dark:text-typo-dark">
                  EUR
                </Text>
              </View>
            </View>

            <View className="mx-auto mt-16 h-20 w-11/12 flex-row items-center justify-between rounded-xl bg-secondary-light dark:bg-secondary-dark">
              <View className="m-3 pt-1">
                <Text className="text-typo-light dark:text-typo-dark">
                  You get
                </Text>
                <Text className="w-48 text-4xl font-semibold text-typo-light dark:text-typo-dark">
                  {(Number(amountIn) * exchangeRate).toString().slice(0, 10)}
                </Text>
              </View>

              <View
                className="h-full w-24 flex-row items-center justify-center rounded-tr-xl rounded-br-xl bg-secondary-light p-2
            dark:bg-tertiary-dark"
              >
                <Image
                  className="mr-2 h-8 w-8 rounded-full"
                  source={require("../../../../assets/eu-flag.jpg")}
                />
                <Text className="text-lg font-bold text-typo-light dark:text-typo-dark">
                  EUR
                </Text>
              </View>
            </View>
          </View>

          <View className="mx-auto mb-8 w-11/12">
            <ActionButton
              text="Checkout with our friends at Moonpay"
              bold
              rounded
              action={() => setShowWebview(true)}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
