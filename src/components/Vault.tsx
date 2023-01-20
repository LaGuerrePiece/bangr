import { useNavigation } from "@react-navigation/native";
import { Text, View, Image, TouchableOpacity } from "react-native";

const Vault = ({
  name,
  description,
  apy,
  color,
  protocol,
}: {
  name: string;
  description: string;
  apy: string;
  color: string;
  protocol: string;
}) => {
  const navigation = useNavigation();
  const getImage = (name: string) => {
    switch (name) {
      case "RocketPool":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/rocketpool.png")}
          />
        );
      case "Ethereum":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/ethereum.png")}
          />
        );
      case "GMX":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/glp.png")}
          />
        );
      case "Velodrome":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/velodrome.png")}
          />
        );
    }
  };
  return (
    <View className="m-auto mt-1 mb-3 w-full rounded-lg bg-secondary-light p-3 shadow-sm dark:bg-secondary-dark">
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            "VaultDeposit" as never,
            {
              name,
              description,
              apy,
              color,
              protocol,
            } as never
          )
        }
      >
        <Image
          className="h-6 w-6"
          source={require("../../assets/ethereum.png")}
        />
        <View className="flex">
          <View className="flex-row justify-between">
            <View className="w-4/5">
              <Text className="text-xl font-bold text-typo-light dark:text-typo-dark">
                {name}
              </Text>
              <Text className="text-typo-light dark:text-typo-dark">
                {description}
              </Text>
            </View>
            {getImage(protocol)}
          </View>
          <View className="mt-2">
            <Text className="text-typo-light dark:text-typo-dark">
              Earn up to
            </Text>
            <View className="flex-row items-end justify-between">
              <Text className="mt-2 text-4xl font-bold" style={{ color }}>
                {apy}% <Text className="text-3xl">APY</Text>
              </Text>
              <Image
                className="h-[16px] w-[24px]"
                source={require("../../assets/arrowright.png")}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Vault;
