import { ChainId } from "../../../packages/common/types/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import useTokensStore from "../state/tokens";
import { Appearance, useColorScheme } from "react-native";
import { chainData } from "../../../packages/common/config/configs";
import { getChain } from "../../../packages/common/utils/utils";

type Props = {
  chain: ChainId;
};

export default function SelectChainButton({ chain }: Props) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  chain = chain || 10;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("SelectChain" as never, { chain } as never);
      }}
    >
      {chain && (
        <View className="flex flex-row items-center px-4">
          <Image
            className="h-8 w-8"
            source={require("../../assets/arbitrum.png")}
          />

          <Text className="mx-1 text-xl font-bold text-typo-light dark:text-typo-dark">
            {getChain(chain)?.name}
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
      )}
    </TouchableOpacity>
  );
}
