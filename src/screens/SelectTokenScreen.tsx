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
import { formatUnits } from "../utils/format";
import { XMarkIcon } from "react-native-heroicons/outline";
import { colors } from "../config/configs";
import * as Haptics from "expo-haptics";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

export default function SelectToken({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SelectToken">) {
  const { tokenList, paramsToPassBack, tokenToUpdate } = route.params;
  const colorScheme = useColorScheme();

  const routes = navigation.getState()?.routes;
  let previousScreenName = routes[routes.length - 2].name as
    | "Send"
    | "VaultDeposit"
    | "MainScreen";

  return (
    <SafeAreaView className="h-full bg-secondary-light dark:bg-secondary-dark">
      <View className="mx-auto h-full w-11/12 rounded-lg p-3">
        <TouchableWithoutFeedback onPress={navigation.goBack}>
          <View className="my-2 flex-row justify-end">
            <XMarkIcon
              size={36}
              color={
                colorScheme === "light" ? colors.typo.light : colors.typo.dark
              }
            />
          </View>
        </TouchableWithoutFeedback>
        <ScrollView>
          {tokenList.map((token, i) => {
            return (
              <TouchableOpacity
                key={i}
                className="mx-2 my-1 flex cursor-pointer flex-row items-center justify-between rounded-md border p-2 dark:border-typo-dark"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  previousScreenName === "MainScreen"
                    ? navigation.navigate("MainScreen", {
                        screen: "Swap",
                        params: {
                          updatedToken: token,
                          tokenToUpdate: tokenToUpdate,
                          ...paramsToPassBack,
                        },
                      })
                    : navigation.navigate(previousScreenName, {
                        updatedToken: token,
                        tokenToUpdate: tokenToUpdate,
                        ...paramsToPassBack,
                      });
                }}
              >
                <View className="flex flex-row items-center">
                  <Image
                    className="h-7 w-7 rounded-full"
                    source={{ uri: token.logoURI }}
                  />
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
      </View>
    </SafeAreaView>
  );
}
