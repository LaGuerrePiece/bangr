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
} from "react-native";
import HomeButton from "../../components/HomeButton";
import useTokensStore from "../../state/tokens";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useCallback, useEffect, useState } from "react";
import useUserStore from "../../state/user";
import Asset from "../../components/Asset";
import * as Haptics from "expo-haptics";

const Wallet = () => {
  const [refreshing, setRefreshing] = useState(false);
  const tokens = useTokensStore((state) => state.tokens);
  const fetchBalances = useUserStore((state) => state.fetchBalances);
  const setLoaded = useUserStore((state) => state.setLoaded);
  const loaded = useUserStore((state) => state.loaded);
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

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

  const showHistoryToast = () => {
    Toast.show({
      type: "info",
      text1: "History",
      text2: "Coming soon, stay tuned!",
    });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loaded === undefined ? (
        <View className="h-screen border-red-500">
          <View className="m-auto">
            <Text className="text-center text-3xl">loading your bags</Text>
            <Image
              className="m-auto h-32 w-32"
              source={
                colorScheme === "dark"
                  ? require("../../../assets/loading-drk.gif")
                  : require("../../../assets/loading.gif")
              }
            />
          </View>
        </View>
      ) : (
        <View className="mx-auto mt-4 w-11/12 items-center rounded-xl">
          <View className="w-full flex-row">
            <View className="w-1/2">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  console.log("swap");
                }}
              >
                <Image
                  className="mr-auto h-7 w-7"
                  source={
                    colorScheme === "dark"
                      ? require("../../../assets/swapicon-drk.png")
                      : require("../../../assets/swapicon.png")
                  }
                />
              </TouchableOpacity>
            </View>
            <View className="w-1/2">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  console.log("swap");
                }}
              >
                <Image
                  className="ml-auto h-7 w-7"
                  source={
                    colorScheme === "dark"
                      ? require("../../../assets/investicon-drk.png")
                      : require("../../../assets/investicon.png")
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          {refreshing && (
            <Text className="text-center text-lg">refreshing...</Text>
          )}
          <View className="mt-4 mb-2 rounded-xl bg-secondary-light py-6  dark:bg-primary-dark">
            <Text className="text-center text-5xl font-bold text-typo-light dark:text-secondary-light">
              ${loaded.toFixed(2)}
            </Text>
            {/* <View className=""><Chart chart={chart} /></View> */}
            <HomeButton />
          </View>

          <View className="w-11/12">
            {tokens ? (
              tokens
                .filter(
                  (token) =>
                    token.symbol !== "aUSDC" &&
                    token.balance &&
                    Number(token.balance) > 0
                )
                .map((token) => <Asset token={token} key={token.symbol} />)
            ) : (
              <View className="">
                <Text className="text-center text-2xl font-bold text-typo-light dark:text-typo-dark">
                  No tokens found
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Wallet;
