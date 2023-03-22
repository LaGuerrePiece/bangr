import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import * as Haptics from "expo-haptics";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { colors } from "../config/configs";

const MainScreen = () => {
  // const { tab, setTab } = useTabStore();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const swiper = useRef(null);
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

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
        backgroundColor: colorScheme === "light" ? "white" : "black",
        width: 12,
        height: 12,
        borderRadius: 8,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 3,
        marginBottom: 3,
        borderWidth: 2,
        borderColor: colorScheme === "light" ? "black" : "white",
      }}
    />
  );

  const activeDot = (
    <View
      style={{
        backgroundColor: colorScheme === "light" ? "black" : "white",
        width: 12,
        height: 12,
        borderRadius: 8,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 3,
        marginBottom: 3,
      }}
    />
  );

  return (
    <Swiper
      loop={false}
      ref={swiper}
      showsPagination={true}
      index={1}
      showsButtons={false}
      dot={dot}
      activeDot={activeDot}
      onMomentumScrollEnd={() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }}
    >
      <View className="m-auto w-full grow dark:bg-primary-dark">
        <Swap swiper={swiper} />
      </View>
      <View
        className="flex h-full w-full justify-between bg-secondary-light dark:bg-primary-dark"
        style={{ paddingTop: insets.top }}
      >
        <View className="m-auto w-full grow">
          <Wallet swiper={swiper} />
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
      <View className="items-center bg-primary-light dark:bg-primary-dark">
        <View className="dark:bg-primary-dark ">
          <Invest swiper={swiper} />
        </View>
      </View>
    </Swiper>
  );
};

export default MainScreen;
