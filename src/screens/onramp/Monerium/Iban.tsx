import { View, Text, useColorScheme, Image, SafeAreaView } from "react-native";
import ActionButton from "../../../components/ActionButton";
import useMoneriumStore from "../../../state/monerium";
import useUserStore from "../../../state/user";
import { useTranslation } from "react-i18next";

const IbanScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();
  const smartWalletAddress = useUserStore((state) => state.smartWalletAddress);
  const { userData, update } = useMoneriumStore((state) => ({
    userData: state.userData,
    update: state.update,
  }));
  const { t } = useTranslation();

  if (
    userData?.kyc?.outcome === "none" ||
    userData?.kyc?.state === "absent" ||
    !userData?.accounts
  ) {
    return (
      <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
        <Text className="mx-auto my-5 w-11/12 font-Inter text-base text-typo-light dark:text-typo-dark">
          {t("MoneriumWait")}
        </Text>

        <View className="mx-auto mb-8 flex-row">
          <ActionButton
            text="Back to Home"
            rounded
            action={() => navigation.navigate("MainScreen")}
          />
        </View>
      </SafeAreaView>
    );
  }

  const accountWithIban = userData.accounts.find(
    (account) =>
      account.iban &&
      account.address.toLowerCase() ===
        (smartWalletAddress as string).toLowerCase()
  );
  console.log("accountsWithIban :", accountWithIban);

  // right now, puts it in state. TODO: send it to the backend
  if (accountWithIban) update({ iban: accountWithIban?.iban });

  if (userData.name && !accountWithIban) {
    return (
      <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
        <Text className="mx-auto my-5 w-11/12 font-Inter text-base text-typo-light dark:text-typo-dark">
          {t("MoneriumAlreadyExists")}
        </Text>

        <View className="mx-auto mb-8 flex-row">
          <ActionButton
            text="Back to Home"
            rounded
            action={() => navigation.navigate("MainScreen")}
          />
        </View>
      </SafeAreaView>
    );
  }

  const routes = navigation.getState()?.routes;
  const previousScreen = routes[routes.length - 2];

  return (
    <SafeAreaView className="h-full w-full justify-between bg-primary-light dark:bg-primary-dark">
      <View className="mx-auto w-11/12">
        <Text className="mt-12 text-center font-InterBold text-2xl text-typo-light dark:text-typo-dark">
          {previousScreen.name === "MoneriumWebview"
            ? "Great ! Account created."
            : "Here is your IBAN"}
        </Text>
        <Text className="my-5 font-Inter text-base text-typo-light dark:text-typo-dark">
          {t("MoneriumDetails")}
        </Text>

        <View className="my-2  rounded-md bg-secondary-light p-2 dark:bg-secondary-dark">
          <Text className="font-Inter text-typo-light dark:text-typo-dark">
            {t("MoneriumBeneficiary")}
          </Text>
          <Text className="font-InterMedium text-lg text-typo-light dark:text-typo-dark">
            {userData.name}
          </Text>
        </View>

        <View className=" my-2 rounded-md bg-secondary-light p-2 dark:bg-secondary-dark">
          <Text className="font-Inter text-typo-light dark:text-typo-dark">
            IBAN
          </Text>
          <Text className="font-InterMedium text-lg text-typo-light dark:text-typo-dark">
            {accountWithIban?.iban}
          </Text>
        </View>

        <View className=" my-2 rounded-md bg-secondary-light p-2 dark:bg-secondary-dark">
          <Text className="font-Inter text-typo-light dark:text-typo-dark">
            BIC
          </Text>
          <Text className="font-InterMedium text-lg text-typo-light dark:text-typo-dark">
            EAPFESM2XXX
          </Text>
        </View>

        <Text className=" my-5 font-Inter text-base text-typo-light dark:text-typo-dark">
          {t("MoneriumWhenFundsReceived")}
        </Text>
      </View>

      <View className="mx-auto mb-8 flex-row">
        <ActionButton
          text={t("Back to wallet")}
          rounded
          action={() => navigation.navigate("MainScreen")}
        />
      </View>
    </SafeAreaView>
  );
};

export default IbanScreen;
