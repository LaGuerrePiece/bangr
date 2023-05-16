import {
  View,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  Image,
  ScrollView,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { colors } from "../../config/configs";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { TouchableOpacity } from "react-native";
import { toastConfig } from "../../components/toasts";
import useRampsStore from "../../state/ramps";
import { track } from "../../utils/analytics";


const OnrampScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();
  const ramps = useRampsStore((state) => state.ramps);

  const RampOption = ({
    logo,
    description,
    name,
    screen,
    instant,
    fees,
    methods,
    comingSoon,
  }: {
    logo: string;
    description: string;
    name: string;
    screen: string;
    instant: boolean;
    fees: string;
    methods: string[];
    comingSoon: boolean;
  }) => {
    return (
      <TouchableOpacity
        className="my-3 w-10/12"
        onPress={() => {
          navigation.navigate(screen);
          track("Onramp Clicked: " + name);
          
        }}
        disabled={comingSoon}
      >
        <View
          className="rounded-2xl bg-secondary-light p-3 text-xl shadow-2xl dark:bg-secondary-dark"
          style={comingSoon ? { opacity: 0.4 } : {}}
        >
          <View className="flex-row">
            <Image className="h-8 w-8 rounded-full" source={{ uri: logo }} />
            <Text className="ml-2 text-2xl font-bold text-typo-light dark:text-typo-dark">
              {name}
            </Text>
          </View>
          <Text className="my-1 text-lg leading-6 text-typo-light dark:text-typo-dark">
            {description}
          </Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-lg text-typo2-light dark:text-typo2-dark">
                Instant
              </Text>
              <View className="flex-row">
                {instant ? (
                  <Image
                    className="h-7 w-7 rounded-full"
                    source={
                      colorScheme === "dark"
                        ? require("../../../assets/onramps/bolt_white.png")
                        : require("../../../assets/onramps/bolt.png")
                    }
                  />
                ) : null}
                <Text className="text-xl font-bold text-typo-light dark:text-typo-dark">
                  {instant ? "Yes" : "No"}
                </Text>
              </View>
            </View>
            <View>
              <Text className="text-lg text-typo2-light dark:text-typo2-dark">
                Fees
              </Text>
              <Text className="text-xl font-bold text-typo-light dark:text-typo-dark">
                {fees}
              </Text>
            </View>
            <View>
              <Text className="text-lg text-typo2-light dark:text-typo2-dark">
                Methods
              </Text>
              <View className="flex-row justify-center">
                {methods.map((method) => {
                  if (method === "card") {
                    return (
                      <Image
                        key={method}
                        className="h-8 w-8 rounded-full"
                        source={
                          colorScheme === "dark"
                            ? require("../../../assets/onramps/card_white.png")
                            : require("../../../assets/onramps/card.png")
                        }
                      />
                    );
                  } else {
                    return (
                      <Image
                        key={method}
                        className="h-8 w-8 rounded-full"
                        source={
                          colorScheme === "dark"
                            ? require("../../../assets/onramps/bank_white.png")
                            : require("../../../assets/onramps/bank.png")
                        }
                      />
                    );
                  }
                })}
              </View>
            </View>
          </View>
        </View>
        {/* {comingSoon ? (
          <Text className="absolute bottom-20 left-20 text-2xl font-bold text-typo-light dark:text-typo-dark">
            Coming soon
          </Text>
        ) : null} */}
      </TouchableOpacity>
    );
  };

  return (
    <View className="h-full items-center bg-primary-light py-6 dark:bg-primary-dark">
      <TouchableWithoutFeedback onPress={navigation.goBack}>
        <View className="w-11/12 flex-row justify-end">
          <XMarkIcon
            size={36}
            color={
              colorScheme === "light" ? colors.typo.light : colors.typo.dark
            }
          />
        </View>
      </TouchableWithoutFeedback>
      <Text className="mt-2 mr-4 font-InterBold text-[22px] leading-9 text-typo-light dark:text-typo-dark">
        Choose a payment option
      </Text>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        className="w-full"
      >
        {ramps ? (
          ramps.map((ramp) => (
            <RampOption
              key={ramp.name}
              logo={ramp.logo}
              description={ramp.description}
              name={ramp.name}
              screen={ramp.screen}
              instant={ramp.instant}
              fees={ramp.fees}
              methods={ramp.methods}
              comingSoon={ramp.comingSoon}
            />
          ))
        ) : (
          <Text className="text-typo-light dark:text-typo-dark">
            No ramp option available now
          </Text>
        )}
      </ScrollView>
      <Toast config={toastConfig} />
    </View>
  );
};

export default OnrampScreen;
