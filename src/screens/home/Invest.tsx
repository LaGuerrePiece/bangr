import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  useColorScheme,
} from "react-native";
import Yield from "../../components/Yield";
import useYieldsStore from "../../state/yields";
import { useTranslation } from "react-i18next";

const Invest = () => {
  const {t} = useTranslation();
  const colorScheme = useColorScheme();
  const yields = useYieldsStore((state) => state.yields);

  // console.log("yields", yields);

  return (
    <SafeAreaView className="h-full bg-secondary-light dark:bg-primary-dark">
      <View className="mx-auto mt-4 w-11/12 items-center">
        {/* <View className="w-full flex-row justify-between">
          <TouchableOpacity
            onPress={() => {
              // swiper.current.scrollBy(-1, true);
            }}
          >
            <Image
              className="h-7 w-7"
              source={
                colorScheme === "dark"
                  ? require("../../../assets/pochicon-drk.png")
                  : require("../../../assets/pochicon.png")
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // swiper.current.scrollBy(1, true);
            }}
          >
            <Image
              className="h-7 w-7"
              source={
                colorScheme === "dark"
                  ? require("../../../assets/settings-drk.png")
                  : require("../../../assets/settings.png")
              }
            />
          </TouchableOpacity>
        </View> */}
      </View>
      <ScrollView>
        <View className="mx-auto w-full">
          <Text className="mb-2 mt-2 text-center font-InterBold text-3xl text-typo-light dark:text-typo-dark">
            {t("Invest")}
          </Text>
          <View className="my-2 mt-4" >

          {yields ? (
            // even is a boolean that is used to alternate the background color of the yield component
             
            yields.map((asset, index) => <Yield key={asset.symbol} asset={asset} even={index % 2 === 0}/>)
          ) : (
            <Text className="mb-2 mt-8 text-center font-Inter text-xl text-typo-light dark:text-typo-dark">
              No opportunities available
            </Text>
          )}
          </View>
        </View>
        <View className="my-16" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Invest;
