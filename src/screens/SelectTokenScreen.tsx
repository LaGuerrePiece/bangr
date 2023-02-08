import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import { MultichainToken } from "../types/types";
import { formatUnits } from "../utils/format";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { XMarkIcon } from "react-native-heroicons/outline";
import useSwapStore from "../state/swap";
import useSendStore from "../state/send";
import { colors } from "../config/configs";

type SelectTokenParams = {
  SelectTokenScreen: {
    tokenList: MultichainToken[];
    tokenToUpdate: "Swap:srcToken" | "Swap:dstToken" | "Send" | "";
  };
};

export default function SelectToken() {
  const navigation = useNavigation();
  const { params } =
    useRoute<RouteProp<SelectTokenParams, "SelectTokenScreen">>();
  const { tokenList, tokenToUpdate } = params;
  const { updateSrcToken, updateDstToken } = useSwapStore();
  const { updateSendToken } = useSendStore();
  const colorScheme = useColorScheme();

  return (
    <View className="h-full bg-secondary-light dark:bg-secondary-dark">
      <SafeAreaView className="mx-auto w-11/12 rounded-lg p-3">
        <View className="my-6">
          <TouchableWithoutFeedback onPress={navigation.goBack}>
            <XMarkIcon
              size={36}
              color={
                colorScheme === "light" ? colors.typo.light : colors.typo.dark
              }
            />
          </TouchableWithoutFeedback>
        </View>
        <ScrollView>
          {tokenList.map((token, i) => {
            return (
              <TouchableOpacity
                key={i}
                className="m-2 flex cursor-pointer flex-row items-center justify-between rounded-md border p-2 dark:border-typo-dark"
                onPress={() => {
                  tokenToUpdate === "Swap:srcToken"
                    ? updateSrcToken(token)
                    : tokenToUpdate === "Swap:dstToken"
                    ? updateDstToken(token)
                    : tokenToUpdate === "Send"
                    ? updateSendToken(token)
                    : null;
                  navigation.goBack();
                }}
              >
                <View className="flex flex-row items-center">
                  <Image className="h-7 w-7" source={{ uri: token.logoURI }} />
                  <View className="mx-3 flex flex-col">
                    <Text className="text-typo-light dark:text-typo-dark">
                      {token.name}
                    </Text>
                    <Text className="text-sm text-typo-light dark:text-typo-dark">
                      {token.symbol}
                    </Text>
                  </View>
                </View>
                <Text className="text-typo-light dark:text-typo-dark">
                  {formatUnits(token.balance, token.decimals, 5)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
