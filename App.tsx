import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WalletScreen from "./src/screens/WalletScreen";
import VaultInfoScreen from "./src/screens/VaultInfoScreen";
import VaultDepositScreen from "./src/screens/VaultDepositScreen";
import TokenScreen from "./src/screens/TokenScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SelectTokenScreen from "./src/screens/SelectTokenScreen";
import SendScreen from "./src/screens/SendScreen";
import ReceiveScreen from "./src/screens/ReceiveScreen";
import Toast from "react-native-toast-message";
import SelectChainScreen from "./src/screens/SelectChainScreen";
import "react-native-gesture-handler";
import OnrampScreen from "./src/screens/OnrampScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen
          name="VaultInfoScreen"
          component={VaultInfoScreen}
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="Token"
          component={TokenScreen}
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="SelectToken"
          component={SelectTokenScreen}
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="SelectChain"
          component={SelectChainScreen}
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen name="VaultDeposit" component={VaultDepositScreen} />
        <Stack.Screen
          name="Send"
          component={SendScreen}
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="Receive"
          component={ReceiveScreen}
          options={{ presentation: "modal", headerShown: false }}
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
      <Toast />
    </NavigationContainer>
  );
};

export default App;
