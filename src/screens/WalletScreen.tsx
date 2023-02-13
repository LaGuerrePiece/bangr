import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Text,
  Appearance,
  Button,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavBar } from "../components/NavBar";
import Card from "./home/Card";
import Invest from "./home/Invest";
import Swap from "./home/Swap";
import Wallet from "./home/Wallet";
import * as SecureStore from "expo-secure-store";
import More from "./home/More";
// import { ScrollView } from "react-native-gesture-handler";
import useTabStore from "../state/tab";

const WalletScreen = () => {
  const { tab, setTab } = useTabStore();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  });

  const logOut = async () => {
    const privKey = await SecureStore.getItemAsync("privKey");
    if (privKey) await SecureStore.deleteItemAsync("privKey");
    navigation.navigate("Login" as never);
  };

  return (
    <View
      className="flex h-full w-full justify-between bg-primary-light dark:bg-primary-dark"
      style={{ paddingTop: insets.top }}
    >
      <View className="m-auto w-full grow">
        {tab === "Swap" && <Swap />}
        {tab === "Invest" && <Invest />}
        {tab === "Wallet" && <Wallet />}
        {tab === "Card" && <Card />}
        {tab === "More" && <More />}
      </View>

      <NavBar tab={tab} setTab={setTab} />

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
    </View>
  );
};

export default WalletScreen;
