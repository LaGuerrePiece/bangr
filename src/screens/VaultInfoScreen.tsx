import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  useColorScheme,
  ScrollView,
  Dimensions,
  Linking,
  TouchableOpacity,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { colors } from "../config/configs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

const VaultInfoScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "VaultInfoScreen">) => {
  const { investment, apy } = route.params;
  const { name, image, description, longDescription, infos } = investment;
  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get("window").width;

  const LinkButton = ({ text, link }: any) => {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(link)}>
        <View className="flex-row items-center rounded-lg bg-quaternary-light p-1 pl-2 dark:bg-primary-dark">
          <Text className="text-typo-light dark:text-typo-dark">{text}</Text>
          <Image
            className="h-7 w-7"
            source={
              colorScheme === "light"
                ? require("../../assets/arrowupright.png")
                : require("../../assets/arrowupright_white.png")
            }
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="h-full bg-secondary-light py-6 dark:bg-secondary-dark">
      <TouchableWithoutFeedback onPress={navigation.goBack}>
        <View className="w-11/12 flex-row justify-end">
          <XMarkIcon
            size={36}
            color={
              colorScheme === "light" ? colors.typo.light : colors.typo.dark
            }
          />
        </View>
      </TouchableWithoutFeedback>
      <ScrollView className="mx-auto mt-2 w-11/12 rounded-lg p-3">
        <View className="mb-6 flex-row justify-between">
          <View className="w-4/5">
            <Text className="mb-1 font-InterSemiBold text-3xl text-typo-light dark:text-secondary-light">
              {name}
            </Text>
            <Text className="text-[17px] text-typo-light dark:text-typo-dark">
              {description}
            </Text>
          </View>
          <Image
            className="h-12 w-12"
            source={{ uri: image }}
            resizeMode="contain"
          />
        </View>
        <Text className="my-1 text-base leading-[22px] text-icon-special dark:text-secondary-light">
          {longDescription}
        </Text>
        {infos ? (
          infos.map((item: any, index: number) => {
            switch (item.type) {
              case "text":
                return (
                  <Text
                    key={index}
                    className="my-1 text-base leading-[22px] text-icon-special dark:text-secondary-light"
                  >
                    {item.text}
                  </Text>
                );
              case "apy":
                return (
                  <Text
                    key={index}
                    className="my-2 text-2xl font-bold text-typo-light dark:text-typo-dark"
                  >
                    Current APY: {apy}%
                  </Text>
                );
              case "image":
                return (
                  <View className="w-full" key={index}>
                    <Image
                      style={{
                        width: (windowWidth * 10) / 12,
                        resizeMode: "contain",
                      }}
                      className="mx-auto"
                      source={require("../../assets/glp-composition.png")}
                    />
                  </View>
                );
              case "links":
                return (
                  <View
                    className="my-4 mb-12 w-full flex-row justify-around"
                    key={index}
                  >
                    {item.links &&
                      item.links.map(
                        (
                          link: { text: string; url: string },
                          indexTwo: number
                        ) => (
                          <LinkButton
                            text={link.text}
                            link={link.url}
                            key={indexTwo}
                          />
                        )
                      )}
                  </View>
                );
            }
          })
        ) : (
          <Text className="my-1 text-typo-light dark:text-typo-dark">
            More coming soon™
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default VaultInfoScreen;
