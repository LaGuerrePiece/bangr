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
import useTabStore from "../state/tab";
import Swiper from "react-native-swiper";
import ReceiveScreen from "./ReceiveScreen";
import SendScreen from "./SendScreen";

const WalletScreen = () => {
  // const { tab, setTab } = useTabStore();
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

  const dot = (
    <View
      style={{
        backgroundColor: "rgba(0,0,0,.2)",
        width: 16,
        height: 16,
        borderRadius: 8,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
      }}
    />
  );

  const activeDot = (
    <View
      style={{
        backgroundColor: "#36220F",
        width: 16,
        height: 16,
        borderRadius: 8,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
      }}
    />
  );

  return (
    <Swiper
      loop={false}
      showsPagination={true}
      index={0}
      showsButtons={false}
      dot={dot}
      activeDot={activeDot}
    >
      <View className="m-auto w-full grow">
        <Swap />
      </View>
      {/* <Swiper
        horizontal={false}
        loop={false}
        showsPagination={false}
        index={1}
        showsButtons={false}
        dot={dot}
        activeDot={activeDot}
      > */}
      {/* <View>
          <ReceiveScreen></ReceiveScreen>
        </View> */}
      <View
        className="flex h-full w-full justify-between bg-secondary-light dark:bg-primary-dark"
        style={{ paddingTop: insets.top }}
      >
        <View className="m-auto w-full grow">
          <Wallet />
        </View>
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
      {/* <View className="m-auto w-full grow">
          <SendScreen />
        </View>
      </Swiper> */}
      <Invest />
    </Swiper>
  );
};

export default WalletScreen;
