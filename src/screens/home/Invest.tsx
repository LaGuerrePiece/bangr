import { View, Text, ScrollView, SafeAreaView } from "react-native";
import Vault from "../../components/Vault";
import useVaultsStore from "../../state/vaults";

const averageApy = (apys: number[]) => {
  return (apys.reduce((acc, cur) => acc + cur, 0) / apys.length).toFixed(2);
};

const Invest = () => {
  const vaults = useVaultsStore((state) => state.vaults);

  return (
    <SafeAreaView className="top-20 h-[90%]">
      <View className="">
        <Text className="text-5xl font-bold text-typo-light dark:text-typo-dark">
          Invest
        </Text>
      </View>
      <View className="h-[90%]">
        <ScrollView className="">
          {vaults &&
            vaults
              .filter((vault) => vault.active)
              .map((vault) => <Vault key={vault.name} vault={vault} />)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Invest;
