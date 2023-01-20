import { MultichainToken } from "../types/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import useTokensStore from "../state/tokens";
import { Appearance, useColorScheme } from "react-native";

type Props = {
  token: MultichainToken;
  tokenToUpdate: string;
  tokensToOmit?: (string | undefined)[];
};

export default function SelectTokenButton({
  token,
  tokenToUpdate,
  tokensToOmit,
}: Props) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const tokens = useTokensStore((state) => state.tokens);
  const tokenList = tokens?.filter((token) =>
    tokensToOmit
      ? tokensToOmit.findIndex((symbol) => token.symbol === symbol) < 0
      : true
  );

  return (
    <TouchableOpacity
      onPress={() => {
        if (!tokenList) return;
        navigation.navigate(
          "SelectToken" as never,
          { tokenList, tokenToUpdate } as never
        );
      }}
    >
      <View className="flex flex-row items-center">
        <Image className="h-8 w-8" source={{ uri: token.logoURI }} />
        <Text className="mx-1 text-xl font-bold text-typo-light dark:text-typo-dark">
          {token.symbol}
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
