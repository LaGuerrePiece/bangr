import { Text, View } from "react-native";

export const Information = ({
  title,
  image,
  text,
  textSize,
  marginLeft,
  styles,
}: {
  title: string;
  image?: any;
  text: string | undefined;
  textSize?: string;
  marginLeft?: number;
  styles?: string;
}) => {
  return (
    <View className={styles}>
      <Text className="font-InterMedium text-xs text-typo-light dark:text-typo-dark">
        {title}
      </Text>
      <View className="flex-row items-center">
        {image}
        <Text
          className={`font-InterSemiBold ${textSize} text-icon-special dark:text-secondary-light`}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};
