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
    case "Swap":
      return (
        <View>
          <Image
            className="mx-auto my-3 h-7 w-7"
            source={
              tab === selected
                ? require("../../assets/swap-selected.png")
                : require("../../assets/swap.png")
            }
          />
          <Text className="mb-2 -mt-2 text-center font-bold text-typo-light dark:text-typo-dark">
            Swap
          </Text>
        </View>
      );

    case "Invest":
      return (
        <View>
          <Image
            className="mx-auto my-3 h-7 w-7"
            source={
              tab === selected
                ? require("../../assets/bangr.png")
                : require("../../assets/bangrs-selected.png")
            }
          />
          <Text className="mb-2 -mt-2 text-center font-bold text-typo-light dark:text-typo-dark">
            Invest
          </Text>
        </View>
      );

    case "Wallet":
      return (
        <View className="mx-auto">
          <Image
            className="my-3 ml-2 h-7 w-7"
            source={
              tab === selected
                ? require("../../assets/poche-selected.png")
                : require("../../assets/poche.png")
            }
          />
          <Text className="mb-2 -mt-2 text-center font-bold text-typo-light dark:text-typo-dark">
            Wallet
          </Text>
        </View>
      );
  }
};

interface NavBar {
  tab: string;
  setTab: (newTab: string) => void;
}

export const NavBar = ({ tab, setTab }: NavBar) => {
  return (
    <View className="mt-14 flex-row">
      <TouchableOpacity
        className="m-auto w-1/3"
        onPress={() => setTab("Wallet")}
      >
        {getTabImage("Wallet", tab)}
      </TouchableOpacity>
      <TouchableOpacity className="m-auto w-1/3" onPress={() => setTab("Swap")}>
        {getTabImage("Swap", tab)}
      </TouchableOpacity>
      <TouchableOpacity
        className="m-auto w-1/3 "
        onPress={() => setTab("Invest")}
      >
        {getTabImage("Invest", tab)}
      </TouchableOpacity>
    </View>
  );
};
