import { colors } from "../config/configs";
import { Appearance, View } from "react-native";

export default function Icon({ icon: Icon }: { icon: any }) {
  return (
    <View>
      <Icon
        color={Appearance.getColorScheme() === "light" ? "#000000" : "#FFFFFF"}
      />
    </View>
  );
}
