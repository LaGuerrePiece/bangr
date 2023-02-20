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
import { ChainId, MultichainToken } from "../types/types";
import { formatUnits } from "../utils/format";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { XMarkIcon } from "react-native-heroicons/outline";
import { chainData, colors } from "../config/configs";
import useSendStore from "../state/send";

type SelectChainParams = {
  SelectChainScreen: {
    chainId: ChainId;
  };
};

export default function SelectChain() {
  const navigation = useNavigation();
  const { params } =
    useRoute<RouteProp<SelectChainParams, "SelectChainScreen">>();
  const { chainId } = params;

  const { update } = useSendStore();
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
          {chainData
            .filter((chain) => chain.chainId !== chainId)
            .map((chain, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  className="m-2 flex cursor-pointer flex-row items-center justify-between rounded-md border p-2 dark:border-typo-dark"
                  onPress={() => {
                    update({ chainId: chain.chainId });
                    navigation.goBack();
                  }}
                >
                  <View className="flex flex-row items-center">
                    {chain.image && (
                      <Image className="h-7 w-7" source={chain.logo} />
                    )}
                    <View className="mx-3 flex flex-col">
                      <Text className="text-typo-light dark:text-typo-dark">
                        {chain.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
