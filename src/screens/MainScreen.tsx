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
import Invest from "./home/Invest";
import Swap from "./home/Swap";
import Wallet from "./home/Wallet";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import ButtonSwiper from "../components/button-swiper";
import { colors } from "../config/configs";
import HistoryScreen from "./HistoryScreen";
import Settings from "./home/Settings";

const MainScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const swiper = useRef(null);
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  });

  const dot = (
    <View
      style={{
        backgroundColor:
          colorScheme === "light" ? "rgba(0,0,0,0)" : "transparent",
        width: 12,
        height: 12,
        borderRadius: 8,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 3,
        marginBottom: 3,
        borderWidth: 2,
        borderColor:
          colorScheme === "light" ? colors.icon.light : colors.icon.dark,
      }}
    />
  );

  const activeDot = (
    <View
      style={{
        backgroundColor:
          colorScheme === "light" ? colors.icon.light : colors.icon.dark,
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

  // Prevents user from going back to CreateAccount/Login screen
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e: any) => {
        e.preventDefault();
      }),
    [navigation]
  );

  return (
    <ButtonSwiper
      loop={false}
      ref={swiper}
      showsPagination={true}
      index={2}
      showsButtons={false}
      dot={dot}
      activeDot={activeDot}
      onMomentumScrollEnd={() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }}
    >
      <HistoryScreen swiper={swiper} />
      <Swap swiper={swiper} />
      <Wallet swiper={swiper} />
      <Invest swiper={swiper} />
      <Settings swiper={swiper} />
    </ButtonSwiper>
  );
};

export default MainScreen;
