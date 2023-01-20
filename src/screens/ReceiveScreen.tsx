import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  useColorScheme,
  TouchableOpacity,
  Share,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import useUserStore from "../state/user";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import Toast from "react-native-toast-message";
import ActionButton from "../components/ActionButton";

const ReceiveScreen = () => {
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
  const fullConfig = resolveConfig(tailwindConfig);
  const smartWalletAddress = useUserStore((state) => state.smartWalletAddress);
  const colorScheme = useColorScheme();
  const colors = fullConfig?.theme?.colors as { typo: any };

  const base64Icon =
    "data:image/png;base64,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Ir26BUMzmMHxIiGi4Eu/eJuX37SMhKCln2tGqsZJHzh/1dX2XmREU5LhlJ4teRz3KFALXvzlH1xfHM2EPGBPe6l66JK7/+cgZFxPTx7ZwEBCNCWGh+g5MHKVI/TvrIujFRER98FUIaKjm3R4VDdtS+h2kBqpGB1x//mGvkG+akREB0iJqBu9yOj8JgN7eMathKhTkYobeWouKETEEuwmxq2M6zwlCCwJ59xLmBy6YP2cVk3FpYiIZfAiIwan0RnvRUd3DzChHmyloRk3iIiH4EVGdMZeJGz1erAcIuIRQMYzV96koDjL/y2RsDwiYgXQwLgd2jkMuzPuaYGpOr+IiC7A0I7bQe9SLAk5xUtnfDQioksw6O315gNbQjwtJxyNiOgBpGg8fukG3G6GMUKR0B0iogf0/RsSKnXSdiSUMUL3iIgesW+UOAyR0B8iog/QeJRrXqQm9E9L3hgbBGheek6NWg/54wul8MVEjfIwu4qIiFVgP+QvVI+kZkEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREQQlEREEJRERBCUREoWYUCwXX27oWcWPpKS+zJAiVKBbytDz7Da0tTLneJ+z8oBFlDtuwkN2mxekHlNtep+SpyxQKt5EglLKzvkSLTx5YvnihVMSUWWGHTHqKNlfn6dTYm9TW3kmCABAFV+ceW364gVPxhPOz5vzQMzze067rD0jThskFvafHKHn6MgmtjecoaJozC1NfnXeueqFGzMykMpphvI0NyQUrzx7R3HefU95jGBaaA7sWnHv0uZdUnLIcK0EvXbGZSWe6EwP3TU1Lapo2ThUo5LatRiYUClE01ktCa4AoOP+/L2h7bdH1Ppx+/74w+eW7cKzMvx3OwOgrf+Wg+SG5pLvvnJWqpXZsXhD5ljgKbnGf4IFUUSu8//z7VOqwDTSqwODw+LCp65+5rRtDehvXjpcpMXiBhOZijRuRFW5IkJLdgiiYnvzylovt3DFw4dptlvEDt9u3dyZo4OLrEh2bAKTh1WePaWdjyctuFaOgE9cigv4L127wDh+6jY5AOuvGxeuQjI3bKOhE97Ix1wWPvDQyAFcRmhmdB8ARJYXGAGk4PfkvKxp6YIKj4J8WJ7/+hDziKSI6GbzwynsmaX/zEh2lmVEfiIchmez2mut9TDIzGmnoiG+TT3yLCNDIFHX9FkfHv3jZr4cbmfjAiAipED7rQDChFQrvp2dSM1QFVYlo4yc6hllCdNeIkkL9wHDMCgvo+YYWnvTg6eCbi1Nf3aMA8FQjHgbPPae81o5FI881Z1rqxzqBRiQzP2lNzWU3Vz3tyxLeyRrGu8tPHrjqiN0QSER0Mjj66nXTND/yEh2BRMjjAQKuLUxTZmHK03jgPmhGbrodkvFC4CLasJC3ikQf8A/o8bKfCFkbkIIz6WnaWJ71LiCnYT6Pt9JTX92lGlEzEYHfZgZAyDjLGOs7K01NFVTRhFjdcIi0O7uFwm3cEEM1pKYi2py8OD4eKur/8JqubRAdu1nIjngfCZVBxIN4axwB/QgIuLz6OGcYN2stoM2xiGjjp7t2goYmMThC0e4+iZJlwO14m9z8+az/bCb2Z0Ym6Bg5VhFtqhUSIEp2JQd5GaJWBsKtc923vZL2Hf32qYuANnUR0SYIIVFLdnCEbKXUDfkw84Gxv61MuproB+oqoE1dRbQJQkiAB7o6Yn3U1TvYdOkbsm1l5q3mIwD5gBIC2ighok1QQtqgpoSQSOGNGC1R80E+pN3szloQ8gGlBLRRSkQba1CcxyD57Q0KEKTwCMsJMSGpao/EQrxdrvMCjHoWxzkM4xclRbQ5GIckeiuoKOkEMoYjnRRNnKD2jsSxy4k6Dw1Gbguvy56fBXbBBGnmvWzeuKuqgDZKi+jEuil3b2A80ChZii1npCu+957rzCDmwSFdjpfs1vrea3Cp9gWsW7JMusvH6p5q6fcoGkZEG0RJ0kPXTS0EKa/TMWFFS73NSu3haAe1sayQFK/OKIr0CtHyue1aRrpyTPAg9B0ehJ5QPfqVo+FEdFIvKUuBiJC0cPzPdzdM6q1EQ4voBN9SEdH16/z2Rq1qynqzfyf0hGYW7+8axXuNLp+TphGxlJMXXxsPUfEtMrUbfALH+QR6ugtIFUx8M4Jp/hM1H3e9qWaSz0nTiliKQ8zrPKM/rmzE3Pu6l/samalmi3pH0TIiloJUHg2Hx4tcW/JBuMqRZ5hfXd1dHhT7qTbF8j3knz/RqI1GELSsiOWw5TQ18yoV6TxHzatBpXWndIh2ZEQm0jNfzJBgISK64CB6mmYP4ZkcU3tJ08xhlmq4NMVDOD6sM7xNSgsVU2aRfggZbSmR7mhExAAYHH5j2GgzevL5/EyrptZq+T806IzaaP00rAAAAABJRU5ErkJggg==";
  return (
    <View className="h-full  items-center bg-primary-light  py-10 dark:bg-primary-dark">
      <Text className="text-5xl font-bold text-typo-light dark:text-typo-dark">
        Receive
      </Text>

      <View className="mx-auto mt-4 mb-2 w-11/12 items-center rounded-xl bg-secondary-light py-6 shadow-xl dark:bg-secondary-dark">
        <QRCode
          value={smartWalletAddress}
          logo={{ uri: base64Icon }}
          size={200}
          logoSize={30}
          logoBackgroundColor="transparent"
          backgroundColor="transparent"
          color={colorScheme === "light" ? colors.typo.light : colors.typo.dark}
        />
        <View className="mx-auto my-4 rounded-xl border border-typo2-light bg-primary-light p-2 dark:border-typo-dark dark:bg-primary-dark">
          <TouchableOpacity
            onPress={() => {
              console.log("smartWalletAddress: ", smartWalletAddress);
              Clipboard.setString(smartWalletAddress ?? "");
              showToast(
                "Address copied to clipboard",
                "You can now paste it anywhere you want"
              );
            }}
          >
            <Text className="text-s text-center font-bold text-typo2-light dark:text-typo2-dark">
              {smartWalletAddress?.substring(0, 12) +
                "..." +
                smartWalletAddress?.substring(34, 42)}
              <View className="h-4 w-4">
                <Image
                  className="h-5 w-5"
                  source={
                    colorScheme === "light"
                      ? require("../../assets/copy.png")
                      : require("../../assets/copy-dark.png")
                  }
                />
              </View>
            </Text>
          </TouchableOpacity>
        </View>
        <ActionButton text="Share" disabled={false} action={onShare} />
      </View>
    </View>
  );
};

export default ReceiveScreen;
