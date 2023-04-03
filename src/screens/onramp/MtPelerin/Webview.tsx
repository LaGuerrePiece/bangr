import { Dimensions, View, useColorScheme } from "react-native";
import useUserStore from "../../../state/user";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { ethers } from "ethers";

const urls = {
  production: "https://widget.mtpelerin.com",
  development: "https://widget-staging.mtpelerin.com",
  real: "https://buy.mtpelerin.com",
};

export default function MtPelerinScreen({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get("window").width;
  const { smartWalletAddress } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
  }));

  let decimalAddress = ethers.BigNumber.from(smartWalletAddress as string).mod(
    10000
  );

  if (Number(decimalAddress.toString()) < 1000) {
    decimalAddress = ethers.BigNumber.from("0").add(1000).add(decimalAddress);
  }

  console.log("code: ", decimalAddress.toString());

  const code = decimalAddress.toString();
  const message = "MtPelerin-" + code;
  const hash = ethers.utils.hashMessage(message);

  console.log("hash", hash);

  const base64Hash = Buffer.from(hash.replace("0x", ""), "hex").toString(
    "base64"
  );

  const params = {
    type: "webview",
    tab: "buy",
    bsc: "EUR",
    bdc: "USDC",
    crys: "agEUR,DAI,ETH,jEUR,LUSD,MATIC,USDC,USDT,WBTC,WETH",
    net: "matic_mainnet",
    // lang: "fr",
    // primary: "000000",
    // success: "000000",
    addr: smartWalletAddress as string,
    code,
    hash: base64Hash,
    chain: "polygon_mainnet",
    rfr: "iDQd63GK",
    mylogo: "https://i.imgur.com/AOy1ol7.png",
    mode: colorScheme as string,
  };

  const webWiewUri = `${urls.production}/?${new URLSearchParams(
    params
  ).toString()}`;

  console.log("webWiewUri", webWiewUri);

  return (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      <WebView
        style={{ width: windowWidth }}
        originWhitelist={["*"]}
        source={{ uri: webWiewUri }}
        // incognito={true}
      />
    </SafeAreaView>
  );
}
