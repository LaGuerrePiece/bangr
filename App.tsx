import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { toastConfig } from "./src/components/toasts";
import { useCallback, useEffect, useState } from "react";
import { Appearance, StatusBar, View, useColorScheme } from "react-native";
import { colors, forceOnboarding } from "./src/config/configs";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";
import * as Linking from "expo-linking";
import "react-native-url-polyfill/auto";
import VaultInfoScreen from "./src/screens/VaultInfoScreen";
import VaultDepositScreen from "./src/screens/VaultDepositScreen";
import TokenScreen from "./src/screens/TokenScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SelectTokenScreen from "./src/screens/SelectTokenScreen";
import SendScreen from "./src/screens/SendScreen";
import ReceiveScreen from "./src/screens/ReceiveScreen";
import SelectChainScreen from "./src/screens/SelectChainScreen";
import OnrampScreen from "./src/screens/onramp";
import TransakScreen from "./src/screens/onramp/Transak";
import MtPelerinScreen from "./src/screens/onramp/MtPelerin";
import MtPelerinWebviewScreen from "./src/screens/onramp/MtPelerin/Webview";
import MoneriumScreen from "./src/screens/onramp/Monerium";
import MoneriumWebviewScreen from "./src/screens/onramp/Monerium/Webview";
import IbanScreen from "./src/screens/onramp/Monerium/Iban";
import OrderConfirmedScreen from "./src/screens/onramp/OrderConfirmed";
import ExchangeScreen from "./src/screens/onramp/Exchange";
import MainScreen from "./src/screens/MainScreen";
import WelcomeScreen from "./src/screens/onboard/Welcome";
import CreateAccountScreen from "./src/screens/onboard/CreateAccount";
import { useStripe } from "@stripe/stripe-react-native";
import { Platform } from "react-native";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const App = () => {
  const colorScheme = useColorScheme();
  const { handleURLCallback } = useStripe();

  const [initialRouteName, setInitialRouteName] = useState("Login");
  const [fontsLoaded] = useFonts({
    Inter: require("./assets/fonts/Inter/Inter-Regular.otf"),
    InterMedium: require("./assets/fonts/Inter/Inter-Medium.otf"),
    InterSemiBold: require("./assets/fonts/Inter/Inter-SemiBold.otf"),
    InterBold: require("./assets/fonts/Inter/Inter-Bold.otf"),
    InterExtraBold: require("./assets/fonts/Inter/Inter-ExtraBold.otf"),
    InterBlack: require("./assets/fonts/Inter/Inter-Black.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const checkifOnboardingNeeded = async () => {
    const privKey = await SecureStore.getItemAsync("privKey");
    if (!privKey || forceOnboarding) {
      setInitialRouteName("Welcome");
    }
  };

  useEffect(() => {
    checkifOnboardingNeeded();
  }, []);

  // Handle getting out for 2FA and returning on ios
  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url && Platform.OS === "ios") {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          console.log("Stripe handled the URL back to the right screen");
        }
      }
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    getUrlAsync();

    const deepLinkListener = Linking.addEventListener(
      "url",
      (event: { url: string }) => {
        handleDeepLink(event.url);
      }
    );

    return () => deepLinkListener.remove();
  }, [handleDeepLink]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.secondary[colorScheme!] }}
      onLayout={onLayoutRootView}
    >
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={initialRouteName}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Wallet" component={MainScreen} />
          <Stack.Screen
            name="VaultInfoScreen"
            component={VaultInfoScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="Token"
            component={TokenScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="SelectToken"
            component={SelectTokenScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="SelectChain"
            component={SelectChainScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="VaultDeposit" component={VaultDepositScreen} />
          <Stack.Screen
            name="Send"
            component={SendScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="Receive"
            component={ReceiveScreen}
            options={{ presentation: "modal" }}
          />
          {/* Onramps */}
          <Stack.Screen
            name="Onramp"
            component={OnrampScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="Transak"
            component={TransakScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="MtPelerin"
            component={MtPelerinScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="MtPelerinWebview"
            component={MtPelerinWebviewScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="Monerium"
            component={MoneriumScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="MoneriumWebview"
            component={MoneriumWebviewScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="Iban"
            component={IbanScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="OrderConfirmed"
            component={OrderConfirmedScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="Exchange"
            component={ExchangeScreen}
            options={{ presentation: "modal" }}
          />
        </Stack.Navigator>
        <Toast config={toastConfig} />
        <StatusBar
          barStyle={
            Appearance.getColorScheme() === "light"
              ? "dark-content"
              : "light-content"
          }
          backgroundColor={
            Appearance.getColorScheme() === "light" ? "white" : "black"
          }
        />
      </NavigationContainer>
    </View>
  );
};

export default App;
