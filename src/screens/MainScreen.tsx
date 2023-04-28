import { useEffect, useRef } from "react";
import { View, Appearance } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Invest from "./home/Invest";
import Swap from "./home/Swap";
import Wallet from "./home/Wallet";
import * as Haptics from "expo-haptics";
import ButtonSwiper from "../components/button-swiper";
import { colors } from "../config/configs";
import HistoryScreen from "./HistoryScreen";
import Settings from "./home/Settings";
import { TabBar } from "./TabBar";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { toastConfig } from "../../src/components/toasts";


const Tab = createMaterialTopTabNavigator();

const MainScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const insets = useSafeAreaInsets();
  // const swiper = useRef(null);
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
      tabBar={(props) => <TabBar {...props}  />}
    >
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Swap" component={Swap} />
      <Tab.Screen name="Wallet" component={Wallet} />
      <Tab.Screen name="Invest" component={Invest} />
      <Tab.Screen name="Settings" component={Settings} />

    </Tab.Navigator>

  );
};

export default MainScreen;
