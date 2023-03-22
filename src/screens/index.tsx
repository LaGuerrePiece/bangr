import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VaultInfoScreen from "./VaultInfoScreen";
import VaultDepositScreen from "./VaultDepositScreen";
import TokenScreen from "./TokenScreen";
import LoginScreen from "./LoginScreen";
import SelectTokenScreen from "./SelectTokenScreen";
import SendScreen from "./SendScreen";
import ReceiveScreen from "./ReceiveScreen";
import SelectChainScreen from "./SelectChainScreen";
import OnrampScreen from "./OnrampScreen";
import TransakScreen from "./onramp/Transak";
import MoneriumScreen from "./onramp/Monerium";
import MainScreen from "./MainScreen";

const Stack = createNativeStackNavigator();

export const HomeScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
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
          animation: "none",
        }}
      />
      <Stack.Screen
        name="Transak"
        component={TransakScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="Monerium"
        component={MoneriumScreen}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
};
