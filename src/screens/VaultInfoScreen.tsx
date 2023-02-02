import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  useColorScheme,
  ScrollView,
  Dimensions,
  Linking,
  TouchableOpacity,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { VaultData } from "../types/types";
import { averageApy } from "../components/Vault";
import { colors } from "../config/configs";
import ActionButton from "../components/ActionButton";

type VaultParams = {
  VaultScreen: {
    vault: VaultData;
  };
};

const getInfo = (name: string) => {
  switch (name) {
    case "Aave USDC":
      return [
        {
          type: "text",
          text: "AAve",
        },
      ];
    case "RocketPool":
      return [
        {
          type: "text",
          text: "earn interest on their deposits.",
        },
      ];
    case "GLP":
      return [
        {
          type: "text",
          text: "GMX is a protocol on which traders can bet on whether assets like BTC or ETH will go up or down. When a trader makes a bet, the GLP pool takes the opposite position, meaning it wins if the trader looses and looses in the trader wins.",
        },
        {
          type: "text",
          text: "By providing liquidity to GMX, you will earn the money traders loose. Additionally, you will earn fees the traders pay for using the platform in all cases. However, if they earn money on average, the APY can be lowered or even go below 0.",
        },
        {
          type: "apy",
        },
        {
          type: "text",
          text: "Keep in mind that when entering this vault, you will be exposed to the assets that GLP is made of. Here is its current composition:",
        },
        {
          type: "image",
          text: "../../assets/glp-composition.png",
        },
        {
          type: "links",
          links: [
            {
              text: "Website",
              url: "https://gmx.io/",
            },
            {
              text: "Docs",
              url: "https://gmxio.gitbook.io/",
            },
            {
              text: "Stats",
              url: "https://stats.gmx.io/",
            },
          ],
        },
      ];
    case "JonesDAO ETH":
      return [
        {
          type: "text",
          text: "earn interest on their deposits.",
        },
      ];
    case "agEUR-USDC":
      return [
        {
          type: "text",
          text: "earn interest on their deposits.",
        },
      ];
    case "agEUR-jEUR":
      return [
        {
          type: "text",
          text: "earn interest on their deposits.",
        },
      ];
    case "Harbor Trade Credit S2":
      return [
        {
          type: "text",
          text: "earn interest on their deposits.",
        },
      ];
  }
};

const VaultInfoScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<VaultParams, "VaultScreen">>();
  const vault = params.vault;
  const { name, image, description, color, protocol } = vault;
  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get("window").width;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  });

  const apy = vault.chains
    ? averageApy(vault.chains.map((chain) => chain.apy)).toString()
    : "0";

  const info = getInfo(name);

  const LinkButton = ({ text, link }: any) => {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(link)}>
        <View className="flex-row items-center rounded-lg bg-primary-light p-1 pl-2 dark:bg-primary-dark">
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
        <View className="mx-auto w-11/12">
          <XMarkIcon
            size={36}
            color={
              colorScheme === "light" ? colors.typo.light : colors.typo.dark
            }
          />
        </View>
      </TouchableWithoutFeedback>
      <ScrollView className="mx-auto mt-5 w-11/12 rounded-lg p-3">
        <View className="mb-6 flex-row justify-between">
          <View className="w-4/5">
            <Text className="mb-1 text-3xl font-bold text-typo-light dark:text-typo-dark">
              {name}
            </Text>
            <Text className="text-gray-500">{description}</Text>
          </View>
          <Image className="h-12 w-12" source={{ uri: image }} />
        </View>
        {info ? (
          info.map((item, index) => {
            switch (item.type) {
              case "text":
                return (
                  <Text
                    key={index}
                    className="my-1 text-typo-light dark:text-typo-dark"
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
                    className="my-2 mb-12 w-full flex-row justify-around"
                    key={index}
                  >
                    {item.links &&
                      item.links.map((link) => (
                        <LinkButton text={link.text} link={link.url} />
                      ))}
                  </View>
                );
            }
          })
        ) : (
          <Text className="my-1 text-typo-light dark:text-typo-dark">
            Coming soon...
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default VaultInfoScreen;
