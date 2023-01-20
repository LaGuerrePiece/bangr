import {
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Text,
} from "react-native";

const getTabImage = (tab: string, selected: string) => {
  switch (tab) {
    case "Wallet":
      if (tab === selected)
        return (
          <View>
            <Image
              className="mx-auto my-3 h-10 w-10"
              source={require("../../assets/wallet.png")}
            />
            <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
              Account
            </Text>
          </View>
        );
      return (
        <View>
          <Image
            className="mx-auto my-3 h-10 w-10"
            source={require("../../assets/wallet.png")}
          />
          <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
            Account
          </Text>
        </View>
      );

    case "Swap":
      if (tab === selected)
        return (
          <View>
            <Image
              className="mx-auto my-3 h-10 w-10"
              source={require("../../assets/swap_selected.png")}
            />
            <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
              Swap
            </Text>
          </View>
        );
      return (
        <View>
          <Image
            className="mx-auto my-3 h-10 w-10"
            source={require("../../assets/swap.png")}
          />
          <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
            Swap
          </Text>
        </View>
      );

    case "Invest":
      if (tab === selected)
        return (
          <View>
            <Image
              className="mx-auto my-3 h-10 w-10"
              source={require("../../assets/stonks_selected.png")}
            />
            <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
              Invest
            </Text>
          </View>
        );
      return (
        <View>
          <Image
            className="mx-auto my-3 h-10 w-10"
            source={require("../../assets/stonks.png")}
          />
          <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
            Invest
          </Text>
        </View>
      );

    case "More":
      if (tab === selected)
        return (
          <View>
            <Image
              className="mx-auto my-3 h-10 w-10"
              source={require("../../assets/more_selected.png")}
            />
            <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
              More
            </Text>
          </View>
        );

      return (
        <View>
          <Image
            className="mx-auto my-3 h-10 w-10"
            source={require("../../assets/more.png")}
          />
          <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
            More
          </Text>
        </View>
      );

    case "Card":
      if (tab === selected)
        return (
          <View>
            <Image
              className="mx-auto my-3 h-10 w-10"
              source={require("../../assets/card_selected.png")}
            />
            <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
              Card
            </Text>
          </View>
        );
      return (
        <View>
          <Image
            className="mx-auto my-3 h-10 w-10"
            source={require("../../assets/card.png")}
          />
          <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
            Card
          </Text>
        </View>
      );

    case "Send":
      if (tab === selected)
        return (
          <View>
            <Image
              className="mx-auto my-3 h-10 w-10"
              source={require("../../assets/wallet.png")}
            />
            <Text className="text-center font-bold text-typo-light dark:text-typo-dark">
              Send
            </Text>
          </View>
        );
      return (
        <View className="mb-2">
          <Image
            className="h-20 w-20"
            source={require("../../assets/sendbtn.png")}
          />
          <Text className="mt-2 text-center font-bold text-typo-light dark:text-typo-dark">
            Send
          </Text>
        </View>
      );

    case "Poche":
      return (
        <View className="mb-2">
          <Image
            className="h-20 w-20"
            source={require("../../assets/poche.png")}
          />
          <Text className="mt-2 text-center font-bold text-typo-light dark:text-typo-dark">
            My poche
          </Text>
        </View>
      );

    default:
      break;
  }
};

interface NavBar {
  tab: string;
  setTab: (newTab: string) => void;
}

export const NavBar = ({ tab, setTab }: NavBar) => {
  return (
    <View className="mt-14 flex flex-row bg-secondary-light dark:bg-secondary-dark">
      <TouchableOpacity className="m-auto w-1/5" onPress={() => setTab("Swap")}>
        <View className="">{getTabImage("Swap", tab)}</View>
      </TouchableOpacity>

      <TouchableOpacity
        className="m-auto w-1/5 "
        onPress={() => setTab("Invest")}
      >
        <View className="">{getTabImage("Invest", tab)}</View>
      </TouchableOpacity>

      <TouchableOpacity
        className="m-auto -mt-4 w-1/5 "
        onPress={() => setTab("Wallet")}
      >
        <View className="">{getTabImage("Poche", tab)}</View>
      </TouchableOpacity>

      <TouchableOpacity
        className="m-auto w-1/5 "
        onPress={() => setTab("Card")}
      >
        <View className="">{getTabImage("Card", tab)}</View>
      </TouchableOpacity>

      <TouchableOpacity
        className="m-auto w-1/5 "
        onPress={() => setTab("More")}
      >
        <View className="">{getTabImage("More", tab)}</View>
      </TouchableOpacity>
    </View>
  );
};
