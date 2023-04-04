import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Appearance,
  ActivityIndicator,
} from "react-native";

import { forceWalletEmpty } from "../../config/configs";
import ActionButton from "../../components/ActionButton";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

const Settings = ({ swiper }: { swiper: any }) => {

  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const navigation = useNavigation();
 
  return (
        <View className="mx-auto mt-4 w-11/12 items-center rounded-xl">
          <View className="w-full flex-row">
            <View className="w-1/2">
              <TouchableOpacity
                onPress={() => {
                  console.log("swap");
                  swiper.current.scrollBy(-1, true);
                }}
              >
                <Image
                  className="mr-auto h-7 w-7"
                  source={
                    colorScheme === "dark"
                      ? require("../../../assets/swap-drk.png")
                      : require("../../../assets/swap.png")
                  }
                />
              </TouchableOpacity>
            </View>
            
          </View>
      
        </View>
  );
};

export default Settings;
