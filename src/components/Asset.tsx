import { useNavigation } from "@react-navigation/native";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { MultichainToken } from "../types/types";
import { ethers } from "ethers";

const Asset = ({ token }: { token: MultichainToken }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
    // onPress={() => navigation.navigate("Token" as never, { token } as never)}
    >
      <View className="flex flex-row items-center justify-between px-5 py-3">
        <View className="flex flex-row items-center">
          <Image
            className="h-12 w-12"
            source={
              token.logoURI
                ? { uri: token.logoURI }
                : require("../../assets/poche.png")
            }
          />
          <View className="ml-3 pr-0">
            <Text className="font-bold text-typo-light dark:text-typo-dark">
              {token.name}
            </Text>
            <Text className="text-typo2-light dark:text-typo2-dark">
              {Number(ethers.utils.formatEther(token.balance || 0)).toFixed(2)}{" "}
              {token.symbol}
            </Text>
          </View>
        </View>
        <View>
          <Text className="font-bold text-typo-light dark:text-typo-dark">
            ${token.quote?.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Asset;
