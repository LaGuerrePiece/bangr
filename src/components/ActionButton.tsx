import { FC } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

interface IButton {
  text: string;
  action: () => void;
  disabled?: boolean;
}

const ActionButton: FC<IButton> = ({ text, disabled, action }) => {
  return (
    <TouchableOpacity onPress={action} activeOpacity={disabled ? 1 : 0.2}>
      <View
        className={`flex-row items-center justify-around rounded-lg py-3 px-4 ${
          !disabled
            ? "bg-btn-light dark:bg-btn-dark"
            : "bg-typo-dark dark:bg-[#2D2D2D]"
        }`}
      >
        <Text
          className={`w-fit text-center text-2xl ${
            !disabled
              ? "text-secondary-light dark:text-secondary-dark"
              : "text-secondary-light dark:text-typo2-light"
          }`}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ActionButton;
