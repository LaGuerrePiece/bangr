import { MultichainToken } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";

type Props = {
  tokens: MultichainToken[];
  selectedToken: MultichainToken;
  paramsToPassBack?: any;
  tokenToUpdate?: string;
};

export default function SelectTokenButton({
  tokens,
  selectedToken,
  paramsToPassBack,
  tokenToUpdate,
}: Props) {
  const navigation = useNavigation() as any;
  const colorScheme = useColorScheme();

  const tokenList = tokens.filter((token) => !token.vaultToken);

  return (
    <TouchableOpacity
      onPress={() => {
        if (!tokenList || tokenList.length < 2) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate("SelectToken", {
          tokenList,
          paramsToPassBack,
          tokenToUpdate,
        });
      }}
    >
      <View className="flex flex-row items-center">
        <Image className="h-8 w-8" source={{ uri: selectedToken.logoURI }} />
        <Text className="mx-1 text-xl font-bold text-typo-light dark:text-typo-dark">
          {selectedToken.symbol}
        </Text>
        {tokenList.length > 1 ? (
          <Image
            className="h-2 w-2"
            source={
              colorScheme === "light"
                ? require("../../assets/chevron.png")
                : require("../../assets/chevron_white.png")
            }
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
