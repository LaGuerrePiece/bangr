import {
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import useUserStore from "../../../state/user";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView, { WebViewNavigation } from "react-native-webview";
import { Toast } from "react-native-toast-message/lib/src/Toast";
// @ts-ignore
import MtPelerinOnOfframp from "react-native-mtp-onofframp";

export default function MtPelerinScreen({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get("window").width;
  const { smartWalletAddress } = useUserStore((state) => ({
    smartWalletAddress: state.smartWalletAddress,
  }));

  const params = {
    type: "webview",
    // type: "direct-link",
    tab: "buy",
    bsc: "EUR",
    bdc: "USDC",
    crys: "agEUR,DAI,ETH,jEUR,LUSD,MATIC,USDC,USDT,WBTC,WETH",
    net: "matic_mainnet",
    // nets: "matic_mainnet,arbitrum_mainnet,optimism_mainnet", //not now, as they do not check EIP1271 on them
    // lang: "fr",
    // primary: "000000",
    // success: "000000",
    addr: smartWalletAddress as string,
    code: "1234",
    chain: "polygon_mainnet",
    rfr: "iDQd63GK",
    mylogo: "https://i.imgur.com/AOy1ol7.png",
    mode: colorScheme as string,
  };

  const urls = {
    production: "https://widget.mtpelerin.com",
    development: "https://widget-staging.mtpelerin.com",
    real: "https://buy.mtpelerin.com",
  };

  const webWiewUri = `${urls.development}/?${new URLSearchParams(
    params
  ).toString()}`;

  console.log("webWiewUri", webWiewUri);

  //buy.mtpelerin.com/?type=direct-link&tabs=buy&bsc=EUR&bdc=BNB&crys=BNB&nets=bsc_mainnet&addr=0x270402aeB8f4dAc8203915fC26F0768feA61b532&code=1234&hash=/37KcpG6mEp+1oAan8/HLEvcfZFXUi6kTOxTHNjD3ZloxS8DL70v7lCmXiEyDOATm4hvewMzBO2d1n25QdJ8WBw=

  https: return (
    <SafeAreaView className="h-full w-full bg-primary-light dark:bg-primary-dark">
      <WebView
        style={{ width: windowWidth }}
        source={{ uri: webWiewUri }}
        // incognito={true}
      />
      {/* <MtPelerinOnOfframp
        // onGetAddresses={() => this.onGetAddresses()}
        // onSignPersonalMessage={params => this.onSignPersonalMessage(params)}
        // onSendTransaction={params => this.onSendTransaction(params)}
        onOffRampOptions={{
          tab: "sell",
          ssc: "MATIC",
          sdc: "CHF",
          type: "web",
        }}
      >
        <View style={[overlay, topOverlay] as any}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={whiteText}>Close</Text>
          </TouchableOpacity>
        </View>
      </MtPelerinOnOfframp> */}
    </SafeAreaView>
  );
}
