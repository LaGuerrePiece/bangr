import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { toastConfig } from "./src/components/toasts";
import { OnboardScreen } from "./src/screens/onboard";
import { HomeScreen } from "./src/screens";
import { useCallback, useEffect, useState } from "react";
import { View, useColorScheme } from "react-native";
import { colors, forceOnboarding } from "./src/config/configs";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-url-polyfill/auto";
import useUserStore from "./src/state/user";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const App = () => {
  const colorScheme = useColorScheme();
  const wallet = useUserStore((state) => state.wallet);
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.secondary[colorScheme!] }}
      onLayout={onLayoutRootView}
    >
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!wallet || forceOnboarding ? (
            <Stack.Screen name="Onboard" component={OnboardScreen} />
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
        <Toast config={toastConfig} />
      </NavigationContainer>
    </View>
  );
};

export default App;
