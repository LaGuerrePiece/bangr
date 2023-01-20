import { View, Text, ScrollView, SafeAreaView } from "react-native";
import Vault from "../../components/Vault";

const Invest = () => {
  return (
    <SafeAreaView className="top-20 h-[90%]">
      <View className="">
        <Text className="text-5xl font-bold text-typo-light dark:text-typo-dark">
          Invest
        </Text>
      </View>
      <View className="h-[90%]">
        <ScrollView className="">
          <Vault
            name="RocketPool"
            description="Contribute to the security of Ethereum by staking ETH with RocketPool"
            apy="4.19"
            color="#E18700"
            protocol="RocketPool"
          />

          <Vault
            name="GLP"
            description="Earn on the losses of gullible traders"
            apy="7.88"
            color="#006CD0"
            protocol="GMX"
          />

          <Vault
            name="agEUR-USDC"
            description="Earn by providing liquidity to traders"
            apy="9.50"
            color="#4EA1ED"
            protocol="Velodrome"
          />

          <Vault
            name="agEUR-USDC"
            description="Earn by providing liquidity to traders"
            apy="9.50"
            color="#4EA1ED"
            protocol="Velodrome"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Invest;
