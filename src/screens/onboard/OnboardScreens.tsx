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
  return (
    <SafeAreaView className="h-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto w-11/12">
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
              Welcome to Bangr
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
                Restore a previous account
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

  useEffect(() => {
    fetchTokensStatic();
  });
  return (
    <OnboardScreenTemplate
      navigation={navigation}
      title="Managing crypto is easy with Bangr"
      image={require("../../../assets/figma/phone.png")}
      text1="Bangr lets you buy, send and swap crypto in minutes"
      text2="Never bother with gas or bridging anymore"
      ButtonText="Next"
      nextPage="SecondScreen"
    />
  );
}

export function SecondScreen({ navigation }: { navigation: any }) {
  return (
    <OnboardScreenTemplate
      navigation={navigation}
      title="Grow your crypto"
      image={require("../../../assets/figma/server.png")}
      text1="Bangr curates the best protocols and lets you deposit seemlessly"
      text2="Don't try to time the market. Let time do it's thing"
      ButtonText="Next"
      nextPage="ThirdScreen"
    />
  );
}

export function ThirdScreen({ navigation }: { navigation: any }) {
  return (
    <OnboardScreenTemplate
      navigation={navigation}
      title="Top-notch security"
      image={require("../../../assets/figma/processor.png")}
      text1="Your keys stay in your phone's Secure Element."
      text2="No more hack ! Secure encrypted backup on iCloud"
      ButtonText="Next"
      nextPage="FourthScreen"
    />
  );
}

export function FourthScreen({ navigation }: { navigation: any }) {
  return (
    <OnboardScreenTemplate
      navigation={navigation}
      title="Your keys, your crypto"
      image={require("../../../assets/figma/security.png")}
      text1="Bangr is non-custodial: we never access your funds"
      text2="Even if we disappeared, you could still recover them !"
      ButtonText="Create my account"
      nextPage="CreateAccount"
      restoreAccountOption={true}
    />
  );
}
