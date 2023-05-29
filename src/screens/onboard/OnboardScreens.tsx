import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  useColorScheme,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import ActionButton from "../../components/ActionButton";
import useTokensStore from "../../state/tokens";
import { useTranslation } from "react-i18next";

function OnboardScreenTemplate({
  navigation,
  title,
  image,
  text1,
  text2,
  ButtonText,
  nextPage,
  restoreAccountOption,
}: {
  navigation: any;
  title: string;
  image: ImageSourcePropType;
  text1: string;
  text2: string;
  ButtonText: string;
  nextPage: string;
  restoreAccountOption?: boolean;
}) {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView className="bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto h-full w-11/12 justify-between">
        <View className="mt-10">
          <View className="flex-row">
            <Image
              className="h-6 w-6"
              source={
                colorScheme === "dark"
                  ? require("../../../assets/newlogo.png")
                  : require("../../../assets/newlogo_black.png")
              }
            />
            <Text className="ml-1 mt-1 font-InterSemiBold text-base text-typo-light dark:text-typo-dark">
              {t("OnboardScreenWelcome")}
            </Text>
          </View>
          <Text className="mt-2 font-InterBold text-[25px] leading-9 text-typo-light dark:text-typo-dark">
            {title}
          </Text>
        </View>

        <Image className="mx-auto h-64 w-64" source={image} />

        <View className="mb-8">
          <View>
            <Text className="my-2 text-center font-InterBold text-lg text-typo-light dark:text-typo-dark">
              {text1}
            </Text>
            <Text className="mx-auto mb-5 w-64 text-center font-[Inter] text-base text-typo-light dark:text-typo-dark">
              {text2}
            </Text>
          </View>
          <ActionButton
            text={ButtonText}
            bold
            rounded
            action={() => navigation.navigate(nextPage)}
          />
          {restoreAccountOption ? (
            <TouchableOpacity
              onPress={() => {
                console.log("aze");
                navigation.navigate("RestoreAccount");
              }}
            >
              <Text className="mt-4 text-center text-typo-light dark:text-typo-dark">
                {t("restore")}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
export function FirstScreen({ navigation }: { navigation: any }) {
  const fetchTokensStatic = useTokensStore((state) => state.fetchTokensStatic);
  const { t } = useTranslation();

  useEffect(() => {
    fetchTokensStatic();
  });

  return (
    <OnboardScreenTemplate
      navigation={navigation}
      title={t("OnboardScreenOneTitle")}
      image={require("../../../assets/figma/phone.png")}
      text1={t("OnboardScreenOneText1")}
      text2={t("OnboardScreenOneText2")}
      ButtonText={t("Next")}
      nextPage="SecondScreen"
    />
  );
}

export function SecondScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  return (
    <OnboardScreenTemplate
      navigation={navigation}
      title={t("OnboardScreenTwoTitle")}
      image={require("../../../assets/figma/security.png")}
      text1={t("OnboardScreenTwoText1")}
      text2={t("OnboardScreenTwoText2")}
      ButtonText={t("Next")}
      nextPage="FourthScreen" //nextPage="ThirdScreen"
    />
  );
}

export function ThirdScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  return (
    <OnboardScreenTemplate
      navigation={navigation}
      title={t("OnboardScreenThreeTitle")}
      image={require("../../../assets/figma/processor.png")}
      text1={t("OnboardScreenThreeText1")}
      text2={t("OnboardScreenThreeText2")}
      ButtonText={t("Next")}
      nextPage="FourthScreen"
    />
  );
}

export function FourthScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  return (
    <OnboardScreenTemplate
      navigation={navigation}
      title={t("OnboardScreenFourTitle")}
      image={require("../../../assets/figma/server.png")}
      text1={t("OnboardScreenFourText1")}
      text2={t("OnboardScreenFourText2")}
      ButtonText={t("createAccount")}
      nextPage="CreateAccount"
      restoreAccountOption={true}
    />
  );
}
