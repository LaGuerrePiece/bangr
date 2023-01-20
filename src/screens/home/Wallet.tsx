import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ScrollView,
} from "react-native";
import Asset from "../../components/Asset";
import HomeButton from "../../components/HomeButton";
import Chart from "../../components/Chart";
import useHistoricStore from "../../state/historic";
import useTokensStore from "../../state/tokens";

const Wallet = () => {
  const tokens = useTokensStore((state) => state.tokens);
  const totalPortfolioValue = tokens
    ?.filter((token) => Number(token.balance) > 1)
    .reduce((a, b) => a + (b.quote ?? 0), 0);

  return (
    <View className="mt-20 mb-10">
      {/* <Text className="text-center text-5xl font-bold">Poche</Text> */}

      {/* <TouchableHighlight onPress={() => console.log("poche")}>
          <Image
            className="h-10 w-10"
            source={require("../../../assets/poche.png")}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => console.log("account")}>
          <Image
            className="h-10 w-10"
            source={require("../../../assets/account.png")}
          />
        </TouchableHighlight> */}

      <View className="mx-auto mt-4 mb-2 w-11/12 rounded-xl bg-secondary-light py-6 shadow-xl dark:bg-secondary-dark">
        <Text className="text-center text-5xl font-bold text-typo-light dark:text-typo-dark">
          ${totalPortfolioValue?.toFixed(2)}
        </Text>
        <View className="">
          <Chart />
        </View>
        <HomeButton />
      </View>
      {/* <View className="m-auto mb-1 w-11/12 flex-row justify-around">
        <View className=" w-1/5">
          <Text className="text-center text-xs font-bold text-typo-light dark:text-typo-dark">
            {" "}
          </Text>
        </View>
        <View className=" w-1/5">
          <Text className="text-center text-xs font-bold text-typo-light dark:text-typo-dark">
            Asset
          </Text>
        </View>
        <View className=" w-1/5">
          <Text className="text-center text-xs font-bold text-typo-light dark:text-typo-dark">
            Balance
          </Text>
        </View>
        <View className=" w-1/5">
          <Text className="text-center text-xs font-bold text-typo-light dark:text-typo-dark">
            Price
          </Text>
        </View>
        <View className="w-1/5">
          <Text className="text-center text-xs font-bold text-typo-light dark:text-typo-dark">
            Value
          </Text>
        </View>
      </View> */}
      <ScrollView className="m-auto w-11/12 rounded-xl bg-secondary-light shadow-xl dark:bg-secondary-dark">
        {tokens ? (
          tokens.map((token) => <Asset token={token} key={token.symbol} />)
        ) : (
          <View className="m-auto">
            <Text className="text-center text-2xl font-bold text-typo-light dark:text-typo-dark">
              No tokens found
            </Text>
          </View>
        )}
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
