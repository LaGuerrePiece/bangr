import { MultichainToken } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Appearance, useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";

type Props = {
  tokens: MultichainToken[];
  selectedToken: MultichainToken;
  tokenToUpdate: string;
};

export default function SelectTokenButton({
  tokens,
  selectedToken,
  tokenToUpdate,
}: Props) {
  const navigation = useNavigation() as any;
  const colorScheme = useColorScheme();

  const tokenList = tokens.filter((token) => token.symbol !== "aUSDC");

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (!tokenList) return;
        navigation.navigate("SelectToken", { tokenList, tokenToUpdate });
      }}
    >
      <View className="flex flex-row items-center">
        <Image className="h-8 w-8" source={{ uri: selectedToken.logoURI }} />
        <Text className="mx-1 text-xl font-bold text-typo-light dark:text-typo-dark">
          {selectedToken.symbol}
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
