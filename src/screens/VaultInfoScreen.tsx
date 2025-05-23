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
import { Protocol } from "../components/Protocol";
import { useTranslation } from "react-i18next";

const VaultInfoScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "VaultInfoScreen">) => {
  const { investment, apy } = route.params;
  const { name, image, description, longDescription, infos } = investment;
  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get("window").width;
  const { t } = useTranslation();

  const {
    name: uiName,
    vaultName,
    longDescription: uiLongDescription,
    contract,
    tvl: uiTvl,
    image: uiImage,
    protocols,
    risks,
  } = investment;

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
      <ScrollView className="m-auto mt-2 w-11/12 rounded-lg p-3">
        <View className="my-3">
          <Text className="font-InterBold text-lg text-icon-special dark:text-secondary-light">
            Description
          </Text>
          <Text className="my-1 text-base leading-[22px] text-icon-special dark:text-secondary-light">
            {t(vaultName + " longDescription")}
          </Text>
        </View>

        <View className="my-3">
          <Text className="font-InterBold text-lg text-icon-special dark:text-secondary-light">
            {t("risks")}
          </Text>
          <Text className="my-1 text-base leading-[22px] text-typo-light dark:text-typo-dark ">
            {t(vaultName + " risks")}
          </Text>
        </View>
        <View>
          <Text className="font-InterBold text-lg text-icon-special dark:text-secondary-light">
            {t("utilized protocols")}
          </Text>
          <View className="flex-wrap">
            {protocols && protocols?.length > 0
              ? protocols?.map((protocol) => {
                  return (
                    <Protocol
                      key={protocol.name}
                      name={protocol.name}
                      image={protocol.icon}
                      link={protocol.link}
                    />
                  );
                })
              : null}
          </View>
        </View>

        {/* <View className="w-full flex-row justify-around">
          {vaultName === "Aave USDC" ? (
            <>
              <LinkButton text={t("Website")} link={"https://aave.com/"} />
              <LinkButton text={"Docs"} link={"https://docs.aave.com/hub/"} />
            </>
          ) : (
            <>
              <LinkButton text={t("Website")} link={"https://lido.fi/"} />
              <LinkButton text={t("Video")} link={"https://lido.fi/"} />
            </>
          )}
        </View> */}

        {/* {infos ? (
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
                    className="my-4 w-full flex-row justify-around"
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
        )} */}
      </ScrollView>
    </View>
  );
};

export default VaultInfoScreen;
