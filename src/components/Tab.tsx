import { Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";

export const Tab = (props: { text: string; action: any; active: boolean }) => {
  const { text, action, active } = props;
  return (
    <TouchableOpacity
      onPress={async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), action();
      }}
    >
      {active ? (
        <View
          className={`mx-1 my-1 w-36 flex-row items-center justify-around rounded-xl bg-[#EFEEEC] py-1 dark:bg-secondary-dark`}
        >
          <Text
            className={`w-fit text-center text-base font-bold text-icon-special dark:text-secondary-light`}
          >
            {text}
          </Text>
        </View>
      ) : (
        <View
          className={`mx-1 my-1 w-36 flex-row items-center justify-around rounded-xl py-1`}
        >
          <Text
            className={`w-fit text-center text-base font-bold text-icon-special dark:text-secondary-light`}
          >
            {text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
