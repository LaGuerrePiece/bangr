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
      if (tab === selected)
        return (
          <View>
            <Image
              className="mx-auto my-3 h-7 w-7"
              source={require("../../assets/swapbtn-selected.png")}
            />
            <Text className="mb-2 -mt-2 text-center font-bold text-typo-light dark:text-typo-dark">
              Swap
            </Text>
          </View>
        );
      return (
        <View>
          <Image
            className="mx-auto my-3 h-7 w-7"
            source={require("../../assets/swapbtn.png")}
          />
          <Text className="mb-2 -mt-2 text-center font-bold text-typo-light dark:text-typo-dark">
            Swap
          </Text>
        </View>
      );

    case "Invest":
      if (tab === selected)
        return (
          <View>
            <Image
              className="mx-auto my-3 h-7 w-7"
              source={require("../../assets/vaultbtn-selected.png")}
            />
            <Text className="mb-2 -mt-2 text-center font-bold text-typo-light dark:text-typo-dark">
              Invest
            </Text>
          </View>
        );
      return (
        <View>
          <Image
            className="mx-auto my-3 h-7 w-7"
            source={require("../../assets/vaultbtn.png")}
          />
          <Text className="-mt-2 mb-2 text-center font-bold text-typo-light dark:text-typo-dark">
            Invest
          </Text>
        </View>
      );

    case "Wallet":
      if (tab === selected)
        return (
          <View className="mx-auto">
            <Image
              className="my-3 ml-2 h-7 w-7"
              source={require("../../assets/poche-selected.png")}
            />
            <Text className="mb-2 -mt-2 text-center font-bold text-typo-light dark:text-typo-dark">
              Poche
            </Text>
          </View>
        );
      return (
        <View className="mx-auto">
          <Image
            className="my-3 ml-2 h-7 w-7"
            source={require("../../assets/poche.png")}
          />
          <Text className="-mt-2 mb-2 text-center font-bold text-typo-light dark:text-typo-dark">
            Poche
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
      <TouchableOpacity
        className="m-auto w-1/3 "
        onPress={() => setTab("Wallet")}
      >
        <View className="">{getTabImage("Wallet", tab)}</View>
      </TouchableOpacity>
      <TouchableOpacity className="m-auto w-1/3" onPress={() => setTab("Swap")}>
        <View className="">{getTabImage("Swap", tab)}</View>
      </TouchableOpacity>
      <TouchableOpacity
        className="m-auto w-1/3 "
        onPress={() => setTab("Invest")}
      >
        <View className="">{getTabImage("Invest", tab)}</View>
      </TouchableOpacity>
    </View>
  );
};
