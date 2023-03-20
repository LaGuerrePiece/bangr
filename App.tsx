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
import { Text, View, useColorScheme } from "react-native";
import { colors, forceOnboarding } from "./src/config/configs";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    "Inter-Black": require("./assets/fonts/Inter/Inter-Black.otf"),
  });

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
    return <AppLoading />;
  } else if (isOnboardingNeeded) {
    return (
      <View
        style={{ flex: 1, backgroundColor: colors.secondary[colorScheme!] }}
      >
        <OnboardScreen />
      </View>
    );
  } else {
    return (
      <View
        style={{ flex: 1, backgroundColor: colors.secondary[colorScheme!] }}
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
