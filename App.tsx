import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VaultInfoScreen from "./src/screens/VaultInfoScreen";
import VaultDepositScreen from "./src/screens/VaultDepositScreen";
import TokenScreen from "./src/screens/TokenScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SelectTokenScreen from "./src/screens/SelectTokenScreen";
import SendScreen from "./src/screens/SendScreen";
import ReceiveScreen from "./src/screens/ReceiveScreen";
import Toast from "react-native-toast-message";
import SelectChainScreen from "./src/screens/SelectChainScreen";
import OnrampScreen from "./src/screens/OnrampScreen";
import { toastConfig } from "./src/components/toasts";
import MainScreen from "./src/screens/MainScreen";
import { OnboardScreen } from "./src/screens/onboard";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import { View, useColorScheme } from "react-native";
import { colors, forceOnboarding } from "./src/config/configs";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    InterBlack: require("./assets/fonts/Inter/Inter-Black.otf"),
    Inter: require("./assets/fonts/Inter/Inter-Regular.otf"),
    InterMedium: require("./assets/fonts/Inter/Inter-Medium.otf"),
    InterSemiBold: require("./assets/fonts/Inter/Inter-SemiBold.otf"),
    InterBold: require("./assets/fonts/Inter/Inter-Bold.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const colorScheme = useColorScheme();

  const [isOnboardingNeeded, setIsOnboardingNeeded] = useState(true);

  const checkIfOnboardingNeeded = async () => {
    const privKey = await SecureStore.getItemAsync("privKey"); // simulate not having account
    if (privKey && !forceOnboarding) {
      setIsOnboardingNeeded(false);
    }
  };

  useEffect(() => {
    checkIfOnboardingNeeded();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (isOnboardingNeeded) {
    return (
      <View
        style={{ flex: 1, backgroundColor: colors.secondary[colorScheme!] }}
        onLayout={onLayoutRootView}
      >
        <OnboardScreen />
      </View>
    );
  } else {
    return (
      <View
        style={{ flex: 1, backgroundColor: colors.secondary[colorScheme!] }}
        onLayout={onLayoutRootView}
      >
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
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
            <Stack.Screen
              name="Onramp"
              component={OnrampScreen}
              options={{
                presentation: "modal",
                headerShown: false,
                animation: "none",
              }}
            />
          </Stack.Navigator>
          <Toast config={toastConfig} />
        </NavigationContainer>
      </View>
    );
  }
};

export default App;
