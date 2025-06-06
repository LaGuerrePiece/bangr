import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Appearance,
  ActivityIndicator,
  useColorScheme,
  Dimensions,
} from "react-native";
import HomeButton from "../../components/HomeButton";
import useTokensStore from "../../state/tokens";
import { useCallback, useEffect, useRef, useState } from "react";
import useUserStore from "../../state/user";
import Asset from "../../components/Asset";
import { forceWalletEmpty } from "../../config/configs";
import ActionButton from "../../components/ActionButton";
import useSettingsStore from "../../state/settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainScreenStackParamList } from "../MainScreen";
import { CompositeScreenProps } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";
import { useTranslation } from "react-i18next";
import { track } from "../../utils/analytics";

const Wallet = ({
  route,
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<MainScreenStackParamList, "Wallet">,
  NativeStackScreenProps<RootStackParamList>
>) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const { scw } = useUserStore((state) => ({
    scw: state.smartWalletAddress,
  }));
  const tokens = useTokensStore((state) => state.tokens);
  const fetchBalances = useUserStore((state) => state.fetchBalances);
  const setLoaded = useUserStore((state) => state.setLoaded);
  const loaded = useUserStore((state) => state.loaded);
  const [backedUp, setBackedUp] = useUserStore((state) => [
    state.backedUp,
    state.setBackedUp,
  ]);
  const currency = useSettingsStore((state) => state.currency);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const SCREEN_WIDTH = Dimensions.get("window").width;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBalances();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    setLoaded(
      tokens
        ?.filter((token) => Number(token.balance) > 1)
        .reduce((a, b) => a + (b.quote ?? 0), 0)
    );
  }, [tokens]);

  const checkBackup = async () => {
    setBackedUp((await AsyncStorage.getItem("backup")) === "true");
  };

  useEffect(() => {
    checkBackup();
  }, []);

  return (
    <SafeAreaView className="h-full bg-secondary-light dark:bg-primary-dark">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loaded === undefined ? (
          <View className="h-screen border-red-500">
            <View className="m-auto">
              <ActivityIndicator />
            </View>
          </View>
        ) : (
          <View className="mx-auto mt-4 w-full items-center">
          
            <View className="mt-2 rounded-xl bg-secondary-light py-8 dark:bg-primary-dark px-8">
              <Text className="text-center text-5xl font-bold text-icon-special dark:text-secondary-light">
                {currency === "Dollar" ? "$" : ""}
                {currency == "Euro"
                  ? (loaded * 0.91)?.toFixed(2)
                  : loaded?.toFixed(2)}
                {currency === "Euro" ? "€" : ""}
              </Text>
              {/* <View className=""><Chart chart={chart} /></View> */}
              <HomeButton />
            </View>

            {!backedUp && (
              <TouchableOpacity
                onPress={() => navigation.navigate("ChoosePassword")}
              >
                <View className="w-11/12 rounded-md border border-[#4F4F4F] bg-[#EFEEEC] dark:bg-secondary-dark">
                  <Text className="px-3 py-2 text-center font-bold text-[#B33A3A] underline">
                    {t("noBackup")}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <View className="w-full">
              {tokens
                ? tokens
                    .filter(
                      (token) =>
                        (token.balance &&
                          // token balance not 0 or token symbol is eth or usdc
                          (Number(token.balance) > 0 ||
                            token.symbol === "ETH" ||
                            token.symbol === "USDC")) ||
                        token.symbol === "USDC"
                    )
                    .map((token, index) => (
                      <Asset
                        token={token}
                        key={token.symbol}
                        navigation={navigation}
                        even= {index % 2 === 0}
                      />
                    ))
                : null}
              {tokens &&
              (forceWalletEmpty ||
                tokens?.reduce((a, token) => a + Number(token.balance), 0) ===
                  0) ? (
                <View className="my-2">
                  <ActionButton
                    text={t("getYourFirstAssets")}
                    bold
                    rounded
                    action={() => {
                      navigation.navigate("Onramp", {});
                      track("Get your first assets", scw);
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Wallet;
