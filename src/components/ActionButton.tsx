import { FC } from "react";
import {
  Button,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";

interface IButton {
  text: string;
  action: () => void;
  icon?: any;
  disabled?: boolean;
  bold?: boolean;
  rounded?: boolean;
  spinner?: boolean;
}

const ActionButton: FC<IButton> = ({
  text,
  icon,
  disabled,
  action,
  bold,
  rounded,
  spinner,
}) => {
  return (
    <TouchableOpacity
      onPress={async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), action();
      }}
      activeOpacity={disabled ? 1 : 0.2}
    >
      <View
        className={`flex-row items-center justify-around ${
          rounded ? "rounded-full" : "rounded-lg"
        }  py-3 px-4 ${
          !disabled
            ? "bg-special-light dark:bg-special-dark"
            : "bg-typo-dark dark:bg-[#2D2D2D]"
        }`}
      >
        {icon ? <Image className="mr-2 h-7 w-7" source={icon} /> : null}
        {spinner ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <Text
            className={`w-fit text-center text-2xl ${bold ? "font-bold" : ""} ${
              !disabled
                ? "text-secondary-light dark:text-secondary-dark"
                : "text-secondary-light dark:text-typo2-light"
            }`}
          >
            {text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ActionButton;
