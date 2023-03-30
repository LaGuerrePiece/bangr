import { View, Text, useColorScheme, Image, SafeAreaView } from "react-native";
import ActionButton from "../../../components/ActionButton";
import useMoneriumStore from "../../../state/monerium";

const IbanScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();
  const { name, iban } = useMoneriumStore((state) => ({
    name: state.name,
    iban: state.iban,
  }));

  const routes = navigation.getState()?.routes;
  const previousScreen = routes[routes.length - 2];

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto w-11/12">
        <Text className="mt-12 text-center font-[InterBold] text-2xl text-typo-light dark:text-typo-dark">
          {previousScreen.name === "MoneriumWebview"
            ? "Great ! Account created."
            : "Here is your IBAN"}
        </Text>
        <Text className="my-5 font-[Inter] text-base text-typo-light dark:text-typo-dark">
          You can use these details to fund your account :
        </Text>

        <View className="my-2  rounded-md bg-secondary-light p-2 dark:bg-secondary-dark">
          <Text className="font-[Inter] text-typo-light dark:text-typo-dark">
            Beneficiary
          </Text>
          <Text className="font-[InterMedium] text-lg text-typo-light dark:text-typo-dark">
            {name}
          </Text>
        </View>

        <View className=" my-2 rounded-md bg-secondary-light p-2 dark:bg-secondary-dark">
          <Text className="font-[Inter] text-typo-light dark:text-typo-dark">
            IBAN
          </Text>
          <Text className="font-[InterMedium] text-lg text-typo-light dark:text-typo-dark">
            {iban}
          </Text>
        </View>

        <View className=" my-2 rounded-md bg-secondary-light p-2 dark:bg-secondary-dark">
          <Text className="font-[Inter] text-typo-light dark:text-typo-dark">
            BIC
          </Text>
          <Text className="font-[InterMedium] text-lg text-typo-light dark:text-typo-dark">
            EAPFESM2XXX
          </Text>
        </View>

        <Text className=" my-5 font-[Inter] text-base text-typo-light dark:text-typo-dark">
          When the funds are received, euros will be credited instantly to your
          account.
        </Text>
      </View>

      <View className="mx-auto mb-8 flex-row">
        <ActionButton
          text="Back to Home"
          rounded
          action={() => navigation.navigate("Wallet")}
        />
      </View>
    </SafeAreaView>
  );
};

export default IbanScreen;
