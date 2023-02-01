import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import Asset from "../../components/Asset";
import HomeButton from "../../components/HomeButton";
import Chart from "../../components/Chart";
import useHistoricStore from "../../state/historic";
import useTokensStore from "../../state/tokens";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const Wallet = () => {
  const tokens = useTokensStore((state) => state.tokens);
  const totalPortfolioValue = tokens
    ?.filter((token) => Number(token.balance) > 1)
    .reduce((a, b) => a + (b.quote ?? 0), 0);

  return (
    <ScrollView>
      <View className="mx-auto mt-20 mb-4 w-11/12 rounded-xl">
        <View className="flex-row justify-between">
          <TouchableWithoutFeedback onPress={() => console.log("history")}>
            <Image
              className="h-10 w-10"
              source={require("../../../assets/history-disabled.png")}
            />
          </TouchableWithoutFeedback>
          <TouchableHighlight
            onPress={() => Linking.openURL("https://tally.so/r/w2jYLb")}
          >
            <Image
              className="h-10 w-10"
              source={require("../../../assets/feedback.png")}
            />
          </TouchableHighlight>
        </View>
        <View className="mt-4 mb-2 rounded-xl bg-secondary-light py-6  dark:bg-secondary-dark">
          <Text className="text-center text-5xl font-bold text-typo-light dark:text-typo-dark">
            ${totalPortfolioValue?.toFixed(2)}
          </Text>
          {/* <View className=""><Chart chart={chart} /></View> */}
          <HomeButton />
        </View>

        <View className="rounded-xl bg-secondary-light px-3 dark:bg-secondary-dark">
          {tokens ? (
            tokens
              .filter((token) => token.symbol !== "aUSDC")
              .map((token) => <Asset token={token} key={token.symbol} />)
          ) : (
            <View className="m-auto">
              <Text className="text-center text-2xl font-bold text-typo-light dark:text-typo-dark">
                No tokens found
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Wallet;
