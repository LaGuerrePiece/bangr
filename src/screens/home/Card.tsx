import { View, Text, ScrollView, SafeAreaView, Image } from "react-native";

const Card = () => {
  return (
    <SafeAreaView className="top-32 h-full">
      <Text className="text-5xl font-bold text-typo-light dark:text-typo-dark">
        Card
      </Text>

      <View className="mx-auto mt-4 mb-8 w-11/12 rounded-xl bg-secondary-light p-8 shadow-xl dark:bg-secondary-dark">
        <View className="m-auto mt-4 flex w-11/12 items-center">
          <Image
            className="h-40"
            resizeMode="contain"
            source={require("../../../assets/visa.png")}
          />
        </View>
        <View className="m-auto mt-4 flex w-11/12 items-center">
          <Text className="text-typo-light dark:text-typo-dark">
            Card coming soon
          </Text>
        </View>
      </View>
      <Text className="text-typo-light dark:text-typo-dark">
        T'inquiète pas avec mes amis on va te trouver une visa
      </Text>
    </SafeAreaView>
  );
};

export default Card;
