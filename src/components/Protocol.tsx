import {
  Appearance,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const Protocol = (props: {
  name: string;
  image: string;
  link: string;
}) => {
  const { name, image, link } = props;
  return (
    <TouchableOpacity onPress={() => Linking.openURL(link)}>
      <View className="my-1 flex-row items-center justify-around rounded-full bg-[#EFEEEC] py-2 px-2 dark:bg-secondary-dark">
        <Image className="h-6 w-6 rounded-full" source={{ uri: image }} />
        <Text className="mx-1 w-fit text-center text-base font-bold text-icon-special dark:text-secondary-light">
          {name}
        </Text>
        <Image
          className="h-6 w-6 rounded-full"
          source={
            Appearance.getColorScheme() === "dark"
              ? require("../../assets/link_white.png")
              : require("../../assets/link.png")
          }
        />
      </View>
    </TouchableOpacity>
  );
};
