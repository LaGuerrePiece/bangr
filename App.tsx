import "react-native-get-random-values";
import "@ethersproject/shims";
import {
  Appearance,
  StatusBar,
  View,
  useColorScheme,
  Platform,
} from "react-native";
import {
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { toastConfig } from "./src/components/toasts";
import { useCallback, useEffect, useState } from "react";
import { colors, forceOnboarding } from "./src/config/configs";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";
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
import MainScreen, { MainScreenStackParamList } from "./src/screens/MainScreen";
import CreateAccountScreen from "./src/screens/onboard/CreateAccount";
import RestoreAccountScreen from "./src/screens/onboard/RestoreAccount";
import ChoosePasswordScreen from "./src/screens/onboard/ChoosePassword";
import ChoosePasswordICloud from "./src/screens/onboard/ChoosePasswordICloud";
import RestoreAccountICloud from "./src/screens/onboard/RestoreAccountICloud";
import {
  FirstScreen,
  FourthScreen,
  SecondScreen,
  ThirdScreen,
} from "./src/screens/onboard/OnboardScreens";
import ChooseVaultScreen from "./src/screens/ChooseVault";
import {
  ChainId,
  Investment,
  MultichainToken,
  VaultData,
  YieldAsset,
} from "./src/types/types";

SplashScreen.preventAutoHideAsync();

// params of all screens
export type RootStackParamList = {
  FirstScreen: undefined;
  SecondScreen: undefined;
  ThirdScreen: undefined;
  FourthScreen: undefined;
  CreateAccount: undefined;
  RestoreAccount: undefined;
  ChoosePassword: undefined;
  Login: undefined;
  MainScreen: NavigatorScreenParams<MainScreenStackParamList>;
  VaultInfoScreen: {
    investment: Investment;
    apy: string;
  };
  HistoryScreen: undefined;
  Token: undefined;
  SelectToken: {
    tokenList: MultichainToken[];
    paramsToPassBack?: any;
    tokenToUpdate?: string;
  };
  SelectChain: {
    chainId: ChainId;
  };
  ChooseVault: {
    asset: YieldAsset;
  };
  VaultDeposit: {
    vault: VaultData;
    investment: Investment;
    updatedToken: MultichainToken | undefined;
  };
  Send: { updatedToken: MultichainToken | undefined };
  Receive: undefined;
  Onramp: undefined;
  Transak: undefined;
  MtPelerin: undefined;
  MtPelerinWebview: undefined;
  Monerium: undefined;
  MoneriumWebview: {
    webWiewUri: string;
    codeVerifier: string;
  };
  Iban: undefined;
  OrderConfirmed: undefined;
  Exchange: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const colorScheme = useColorScheme();
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
      setInitialRouteName("FirstScreen");
    }
  };

  useEffect(() => {
    checkifOnboardingNeeded();
  }, []);

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
          initialRouteName={initialRouteName as keyof RootStackParamList}
        >
          <Stack.Screen
            name="FirstScreen"
            component={FirstScreen}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="SecondScreen"
            component={SecondScreen}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="ThirdScreen"
            component={ThirdScreen}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="FourthScreen"
            component={FourthScreen}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="CreateAccount"
            component={CreateAccountScreen}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="RestoreAccount"
            component={
              Platform.OS === "android"
                ? RestoreAccountScreen
                : RestoreAccountICloud
            }
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="ChoosePassword"
            component={
              Platform.OS === "android"
                ? ChoosePasswordScreen
                : ChoosePasswordICloud
            }
            options={{ animation: "slide_from_left", presentation: "modal" }}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={{ gestureEnabled: false }}
          />
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
          <Stack.Screen name="ChooseVault" component={ChooseVaultScreen} />
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
        {/* <Toaster/> */}
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
