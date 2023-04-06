import { ChainId } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "react-native";
import { getChain } from "../utils/utils";

type Props = {
  chainId: ChainId;
};

export default function SelectChainButton({ chainId }: Props) {
  const navigation = useNavigation() as any;
  const colorScheme = useColorScheme();
  const chain = getChain(chainId);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("SelectChain", { chainId });
      }}
    >
      <View className="flex flex-row items-center px-4">
        <Image className="h-8 w-8" source={chain.logo} />

        <Text className="mx-1 text-xl font-bold text-typo-light dark:text-typo-dark">
          {chain.name}
        </Text>
        <Image
          className="h-2 w-2"
          source={
            colorScheme === "light"
              ? require("../../assets/chevron.png")
              : require("../../assets/chevron_white.png")
          }
        />
      </View>
    </TouchableOpacity>
  );
}
