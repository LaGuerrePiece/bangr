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
import Constants from "expo-constants";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@env";
import * as Linking from "expo-linking";
import appJson from "../../../../app.json";

const API_URL = `http://${Constants.manifest?.debuggerHost
  ?.split(":")
  .shift()}:4242`;

export default function Bangramp({ navigation }: { navigation: any }) {
  const [amountIn, setAmountIn] = useState<string>("50");

  const exchangeRate = 0.98;
  const { initPaymentSheet, presentPaymentSheet, handleURLCallback } =
    useStripe();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const returnURL = Linking.createURL("stripe-redirect", {
      queryParams: { hello: "world" },
    });

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Bangr",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
      returnURL,
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code !== "Canceled") return;
      Alert.alert(
        `It seems like an error occured: ${error.code}`,
        `${error.message}. Please contact us !`
      );
    } else {
      navigation.navigate("OrderConfirmed");
    }
  };

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLIC_KEY}
      urlScheme={appJson.expo.scheme} // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
      <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
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
            text="Next"
            bold
            rounded
            disabled={!loading}
            action={openPaymentSheet}
          />
        </View>
      </SafeAreaView>
    </StripeProvider>
  );
}
