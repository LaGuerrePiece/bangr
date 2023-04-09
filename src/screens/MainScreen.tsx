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

const MainScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const insets = useSafeAreaInsets();
  const swiper = useRef(null);
  const colorScheme = Appearance.getColorScheme();

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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    >
      <HistoryScreen swiper={swiper} />
      <Swap
        swiper={swiper}
        updatedToken={route.params?.updatedToken}
        tokenToUpdate={route.params?.tokenToUpdate}
      />
      <Wallet swiper={swiper} />
      <Invest swiper={swiper} />
      <Settings swiper={swiper} />
    </ButtonSwiper>
  );
};

export default MainScreen;
