import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./welcome";
import PasswordScreen from "./password";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export const OnboardScreen = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Welcome"
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Password" component={PasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
