import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  useColorScheme,
  TouchableOpacity,
  Share,
  TextInput,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import QRCode from "react-native-qrcode-svg";
import useUserStore from "../state/user";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import Toast from "react-native-toast-message";
import ActionButton from "../components/ActionButton";
import SelectTokenButton from "../components/SelectTokenButton";
import SelectChainButton from "../components/SelectChainButton";
import useTokensStore from "../state/tokens";
import useSendStore from "../state/send";
import { useEffect } from "react";
import { chainData, SWAP_DEBOUNCE_THRESHOLD } from "../config/configs";

const SendScreen = () => {
  const {
    amountIn,
    debouncedAmountIn,
    srcToken,
    chain,
    quote,
    calls,
    isSearching,
    update,
    set,
  } = useSendStore();
  const tokens = useTokensStore((state) => state.tokens);
  const showToast = (text1: string, text2: string) => {
    Toast.show({
      type: "success",
      text1: text1,
      text2: text2,
    });
  };
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: smartWalletAddress || "",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      showToast("Error", error.message);
    }
  };
  const smartWalletAddress = useUserStore((state) => state.smartWalletAddress);
  const fullConfig = resolveConfig(tailwindConfig);
  const colorScheme = useColorScheme();
  const colors = fullConfig?.theme?.colors as { typo: any; typo2: any };

  useEffect(() => {
    if (!srcToken) {
      const usdc = tokens?.find((token) => token.symbol === "USDC");
      if (usdc) update({ srcToken: usdc });
    }
  });
  useEffect(() => {
    if (!chain) {
      const op = 10;
      if (op) update({ chain: op });
    }
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      set({ debouncedAmountIn: amountIn });
    }, SWAP_DEBOUNCE_THRESHOLD);
    return () => {
      clearTimeout(handler);
    };
  }, [amountIn]);

  useEffect(() => {
    // if (debouncedAmountIn) updateQuote(debouncedAmountIn);
  }, [debouncedAmountIn, srcToken, chain]);

  return (
    <View className="h-full items-center bg-primary-light  py-10 dark:bg-primary-dark">
      <Text className="text-5xl font-bold text-typo-light dark:text-typo-dark">
        Send
      </Text>

      <View className="mx-auto mt-4 mb-2 w-11/12 items-center rounded-xl bg-secondary-light py-6 shadow-xl dark:bg-secondary-dark">
        <View className="flex-row items-center">
          {srcToken && (
            <View className="mx-4">
              <SelectTokenButton token={srcToken} tokenToUpdate={"srcToken"} />
            </View>
          )}
          {chainData && (
            <View className="mx-4">
              <SelectChainButton chain={10} />
            </View>
          )}
        </View>
        <View className="mx-auto my-4 rounded-xl border bg-primary-light p-2  dark:bg-primary-dark">
          <TextInput
            style={{
              color:
                colorScheme === "light" ? colors.typo.light : colors.typo.dark,
            }}
            placeholderTextColor={colors.typo2.light}
            className="my-1 text-4xl font-semibold text-typo-light dark:text-typo-dark"
            // onChangeText={handleInputChange}
            value={amountIn ?? ""}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>

        <ActionButton text="Send" disabled={false} action={() => onShare()} />
      </View>
    </View>
  );
};

export default SendScreen;
