import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Linking,
} from "react-native";
import ActionButton from "../../components/ActionButton";

const More = () => {
  return (
    <SafeAreaView className="top-32 h-full">
      <View className="mx-auto mt-4 mb-8 w-11/12 rounded-xl bg-secondary-light p-8 shadow-xl dark:bg-secondary-dark">
        <View className="m-auto mt-4 w-11/12 items-center">
          <Text className="mb-10 text-typo-light dark:text-typo-dark">
            Feedback is welcome!
          </Text>
          <ActionButton
            text="Feedback"
            disabled={false}
            action={() => Linking.openURL("https://tally.so/r/w2jYLb")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default More;
