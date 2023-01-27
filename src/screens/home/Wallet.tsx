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
    <View className="mx-auto mt-20 mb-4 w-11/12 rounded-xl">
      <ScrollView className="mx-auto w-full rounded-xl  shadow-xl">
        <View className="mx-auto ">
          <View className="flex flex-row ">
            <View className="ml-4 mr-60 ">
              <TouchableWithoutFeedback onPress={() => console.log("history")}>
                <Image
                  className="h-10 w-10"
                  source={require("../../../assets/history-disabled.png")}
                />
              </TouchableWithoutFeedback>
            </View>
            <View className="mx-1">
              <TouchableHighlight
                onPress={() => Linking.openURL("https://tally.so/r/w2jYLb")}
              >
                <Image
                  className="h-10 w-10"
                  source={require("../../../assets/feedback.png")}
                />
              </TouchableHighlight>
            </View>
          </View>
          <View className="mx-auto mt-4 mb-2 rounded-xl bg-secondary-light py-6 shadow-xl dark:bg-secondary-dark">
            <Text className="text-center text-5xl font-bold text-typo-light dark:text-typo-dark">
              ${totalPortfolioValue?.toFixed(2)}
            </Text>
            <View className="">
              <Chart />
            </View>
            <HomeButton />
          </View>

          {/* <ScrollView className="m-auto w-11/12 rounded-xl bg-secondary-light shadow-xl dark:bg-secondary-dark"> */}
          <View className=" rounded-xl bg-secondary-light shadow-xl dark:bg-secondary-dark">
            {tokens ? (
              tokens.map((token) => <Asset token={token} key={token.symbol} />)
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
      <View className="my-auto">
        {/* <TouchableHighlight
          className="m-auto text-center"
          onPress={() => console.log("account")}
        >
          <Image
            className="h-10 w-10"
            source={require("../../../assets/bottomArrow.png")}
          />
        </TouchableHighlight> */}
      </View>
    </View>
  );
};

export default Wallet;
