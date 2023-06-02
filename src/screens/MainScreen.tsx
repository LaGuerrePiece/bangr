import { useEffect } from "react";
import { Appearance } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Invest from "./home/Invest";
import Swap from "./home/Swap";
import Wallet from "./home/Wallet";
import History from "./home/History";
import Settings from "./home/Settings";
import { TabBar } from "./TabBar";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MultichainToken } from "../types/types";
import { useTranslation } from "react-i18next";

export type MainScreenStackParamList = {
  History: {
    waitingForTask?: boolean;
  };
  Swap: {
    tokenToUpdate?: string;
    updatedToken?: MultichainToken;
  };
  Wallet: undefined;
  Invest: undefined;
  Settings: undefined;
};

const Tab = createMaterialTopTabNavigator<MainScreenStackParamList>();

const MainScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const colorScheme = Appearance.getColorScheme();

  // Prevents user from going back to CreateAccount/Login screen
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e: any) => {
        e.preventDefault();
      }),
    [navigation]
  );

  return (
    <Tab.Navigator
      initialRouteName="Wallet"
      backBehavior="order"
      tabBarPosition="bottom"
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Swap" component={Swap} />
      <Tab.Screen name="Wallet" component={Wallet} />
      <Tab.Screen name="Invest" component={Invest} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default MainScreen;
