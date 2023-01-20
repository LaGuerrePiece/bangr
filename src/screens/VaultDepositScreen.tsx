import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  ArrowLeftIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";
import ActionButton from "../components/ActionButton";

type VaultParams = {
  VaultDepositScreen: {
    name: string;
    description: string;
    apy: string;
    color: string;
    protocol: string;
  };
};

const VaultDepositScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<VaultParams, "VaultDepositScreen">>();
  const { name, description, apy, color, protocol } = params;
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("USDC");
  const [items, setItems] = useState([{ label: "USDC", value: "USDC" }]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  });

  const getImage = (name: string) => {
    switch (name) {
      case "RocketPool":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/rocketpool.png")}
          />
        );
      case "Ethereum":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/ethereum.png")}
          />
        );
      case "GMX":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/glp.png")}
          />
        );
      case "Velodrome":
        return (
          <Image
            className="h-12 w-12"
            source={require("../../assets/velodrome.png")}
          />
        );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="bg-primary-light dark:bg-primary-dark">
        <View className="mx-auto h-full w-11/12 rounded-lg p-3">
          <View className="flex">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "Vault" as never,
                  { name, description, apy, color, protocol } as never
                )
              }
            >
              <Text className="text-md mb-3 text-right font-bold text-typo-light dark:text-typo-dark">
                HOW IT WORKS
              </Text>
            </TouchableOpacity>
            <View className="mb-6 flex-row justify-between">
              <View className="w-4/5">
                <View className="flex-row items-center">
                  <TouchableWithoutFeedback onPress={navigation.goBack}>
                    <ArrowLeftIcon size={24} />
                  </TouchableWithoutFeedback>
                  <Text className="ml-1 text-2xl font-bold text-typo-light dark:text-typo-dark">
                    Deposit in {name}
                  </Text>
                </View>
              </View>
              {getImage(protocol)}
            </View>
          </View>
          <DropDownPicker
            style={{ backgroundColor: "#EFEEEC" }}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
          <View className="mt-6 h-16 flex-row items-center justify-center rounded-lg bg-secondary-light dark:bg-secondary-dark">
            <TextInput
              className="w-4/5 text-4xl text-typo-light dark:text-typo-dark"
              onChangeText={setAmount}
              value={amount}
              keyboardType="numeric"
              placeholder="0"
            />
            <TouchableOpacity onPress={() => console.log("Clicked on max")}>
              <View className="rounded-xl bg-btn-light px-3 py-1 dark:bg-btn-dark">
                <Text className="text-secondary-light dark:text-secondary-dark">
                  MAX
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="mt-12 flex-row justify-evenly">
            <ActionButton
              text="WITHDRAW"
              disabled={true}
              action={() => console.log("clicked on withdraw")}
            />
            <ActionButton
              text="DEPOSIT"
              disabled={false}
              action={() => console.log("clicked on deposit")}
            />
          </View>

          <View className="mt-6 h-36 rounded-lg bg-secondary-light p-2 dark:bg-secondary-dark">
            <View className="flex-row items-center">
              <Text className="font-bold text-typo-light dark:text-typo-dark">
                Estimated returns based on current APY
              </Text>
              <InformationCircleIcon color="#1C1C1C" />
            </View>
          </View>

          <View className="mt-6 h-36 rounded-lg bg-secondary-light p-2 dark:bg-secondary-dark">
            <View className="flex-row items-center">
              <Text className="font-bold text-typo-light dark:text-typo-dark">
                Details:
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VaultDepositScreen;
