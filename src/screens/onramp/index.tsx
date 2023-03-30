import {
  View,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  Image,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { colors } from "../../config/configs";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { TouchableOpacity } from "react-native";
import { toastConfig } from "../../components/toasts";

const OnrampScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();

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
    logo: number;
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
        }}
        disabled={comingSoon}
      >
        <View
          className="rounded-2xl bg-secondary-light p-3 text-xl shadow-2xl dark:bg-secondary-dark"
          style={comingSoon ? { opacity: 0.4 } : {}}
        >
          <View className="flex-row">
            <Image className="h-8 w-8 rounded-full" source={logo} />
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
        {comingSoon ? (
          <Text className="absolute bottom-20 left-20 text-2xl font-bold text-typo-light dark:text-typo-dark">
            Coming soon
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View className="h-full items-center bg-primary-light py-6 dark:bg-primary-dark">
      <TouchableWithoutFeedback onPress={navigation.goBack}>
        <View className="mx-auto w-11/12">
          <XMarkIcon
            size={36}
            color={
              colorScheme === "light" ? colors.typo.light : colors.typo.dark
            }
          />
        </View>
      </TouchableWithoutFeedback>
      <View className="flex w-full items-center">
        <Text className="mt-2 mr-4 font-[InterBold] text-[22px] leading-9 text-typo-light dark:text-typo-dark">
          Choose a payment option
        </Text>
        <RampOption
          logo={require("../../../assets/onramps/transak_logo.png")}
          description={"Cards, banks and international options."}
          name={"Transak"}
          screen={"Transak"}
          instant={true}
          fees={"1-3.5%"}
          methods={["card", "bank"]}
          comingSoon={false}
        />
        <RampOption
          logo={require("../../../assets/onramps/mt_pelerin_logo.png")}
          description={"0% fee on first bank transfer up to 500€."}
          name={"Mt Pelerin"}
          screen={"MtPelerin"}
          instant={true}
          fees={"0-2.5%"}
          methods={["card", "bank"]}
          comingSoon={true}
        />
        <RampOption
          logo={require("../../../assets/onramps/monerium_logo.png")}
          description={"For large amounts, Monerium is the best."}
          name={"Monerium"}
          screen={"Monerium"}
          instant={true}
          fees={"0%"}
          methods={["bank"]}
          comingSoon={true}
        />
      </View>
      <Toast config={toastConfig} />
    </View>
  );
};

export default OnrampScreen;
