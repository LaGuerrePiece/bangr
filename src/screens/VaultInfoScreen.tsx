import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  useColorScheme,
  ScrollView,
  Dimensions,
  Linking,
  TouchableOpacity,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { VaultData } from "../types/types";
import { averageApy } from "../components/Vault";
import { colors } from "../config/configs";

type VaultParams = {
  VaultScreen: {
    vault: VaultData;
  };
};

const getInfo = (name: string) => {
  switch (name) {
    case "Aave | USDC":
      return [
        {
          type: "text",
          text: "Aave is a protocol on which users can borrow and lend assets. Lenders earn interest payed by borrowers. When someone takes out a loan on Aave, he must deposit more collateral value than what he borrows.",
        },
        {
          type: "links",
          links: [
            {
              text: "Website",
              url: "https://aave.com/",
            },
            {
              text: "Docs",
              url: "https://docs.aave.com/hub/",
            },
          ],
        },
      ];
    case "Rocket Pool | Ether":
      return [
        {
          type: "text",
          text: "To create an Ethereum node, node operator normally have to lock 16 ETH in collateral. RocketPool is a protocol that allows users to create ethereum nodes with only 8 ETH, the 8 remaining coming from rETH holders.",
        },
        {
          type: "text",
          text: "By buying rETH, anybody can help create more nodes to secure the network. The rewards are then shared between the node operator and rETH holders.",
        },
        {
          type: "links",
          links: [
            {
              text: "Website",
              url: "https://rocketpool.net/",
            },
            {
              text: "Explainer",
              url: "https://medium.com/rocket-pool/rocket-pool-staking-protocol-part-1-8be4859e5fbd",
            },
          ],
        },
      ];
    case "GLP":
      return [
        {
          type: "text",
          text: "GMX is a protocol on which traders can bet on whether assets like BTC or ETH will go up or down. When a trader makes a bet, the GLP pool takes the opposite position, meaning it wins if the trader looses and looses in the trader wins.",
        },
        {
          type: "text",
          text: "By providing liquidity to GMX, you will earn the money traders loose. Additionally, you will earn fees the traders pay for using the platform in all cases. However, if they earn money on average, the APY can be lowered or even go below 0.",
        },
        {
          type: "apy",
        },
        {
          type: "text",
          text: "Keep in mind that when entering this vault, you will be exposed to the assets that GLP is made of. Here is its current composition:",
        },
        {
          type: "image",
          text: "../../assets/glp-composition.png",
        },
        {
          type: "links",
          links: [
            {
              text: "Website",
              url: "https://gmx.io/",
            },
            {
              text: "Docs",
              url: "https://gmxio.gitbook.io/",
            },
            {
              text: "Stats",
              url: "https://stats.gmx.io/",
            },
          ],
        },
      ];
    case "JonesDAO's ETH":
      return [
        {
          type: "text",
          text: "JonesDAO's jETH generates yield with a proprietary hedged options strategy. Vault and strategy parameters are under the supervision of the DAO strategy team.",
        },
        {
          type: "links",
          links: [
            {
              text: "Website",
              url: "https://www.jonesdao.io/",
            },
            {
              text: "Docs",
              url: "https://docs.jonesdao.io/jones-dao/",
            },
          ],
        },
      ];
    case "JonesDAO's GLP":
      return [
        {
          type: "text",
          text: "JonesDAO's jGLP is a leveraged version of GLP. Like GLP, it generates yield for the loss of traders on GMX and from the fees they pay. However, it also uses leverage to increase the APY.",
        },
        {
          type: "links",
          links: [
            {
              text: "Website",
              url: "https://www.jonesdao.io/",
            },
            {
              text: "Docs",
              url: "https://docs.jonesdao.io/jones-dao/",
            },
            {
              text: "GLP",
              url: "https://gmx.io/",
            },
          ],
        },
      ];
    case "agEUR-USDC":
      return [
        {
          type: "text",
          text: "Velodrome Finance is a decentralized exchange on Optimism. It allows anybody to trade one token for another.",
        },
        {
          type: "text",
          text: "Just like on Uniswap, users can provide liquidity to traders by locking their tokens on a pair. The pair will then earn fees from traders.",
        },
        {
          type: "text",
          text: "When entering this vault, 50% of the value will be swapped for agEUR and 50% for USDC. They will then be deposited in the agEUR-USDC pair on Velodrome Finance.",
        },
        {
          type: "text",
          text: "USDC is a USD centralized stablecoin managed by Circle.",
        },
        {
          type: "text",
          text: "agEUR is a decentralized stablecoin pegged to the Euro. It is managed by the Angle Protocol.",
        },
        {
          type: "links",
          links: [
            {
              text: "Velodrome",
              url: "https://docs.velodrome.finance/",
            },
            {
              text: "Circle",
              url: "https://www.circle.com/en/",
            },
            {
              text: "Angle",
              url: "https://www.angle.money/",
            },
          ],
        },
      ];
    case "agEUR-jEUR":
      return [
        {
          type: "text",
          text: "Velodrome Finance is a decentralized exchange on Optimism. It allows anybody to trade one token for another.",
        },
        {
          type: "text",
          text: "Just like on Uniswap, users can provide liquidity to traders by locking their tokens on a pair. The pair will then earn fees from traders.",
        },
        {
          type: "text",
          text: "When entering this vault, 50% of the value will be swapped for agEUR and 50% for jEUR. They will then be deposited in the agEUR-jEUR pair on Velodrome Finance.",
        },
        {
          type: "text",
          text: "agEUR is a decentralized Euro stablecoin managed by the Angle Protocol.",
        },
        {
          type: "text",
          text: "jEUR is a Euro stablecoin managed by Jarvis Network.",
        },
        {
          type: "links",
          links: [
            {
              text: "Velodrome",
              url: "https://docs.velodrome.finance/",
            },
            {
              text: "Angle",
              url: "https://www.angle.money/",
            },
            {
              text: "Jarvis",
              url: "https://jarvis.network/",
            },
          ],
        },
      ];
    case "Harbor Trade Credit S2":
      return [
        {
          type: "text",
          text: "Centrifuge is a real-world asset protocol. It uses DeFi liquidity pools to provide loans to businesses.",
        },
        {
          type: "text",
          text: "This pool is used by Harbor, a fintech company that makes short term loans (60 to 120 days) to businesses to let them deal with supply chain delays.",
        },
        {
          type: "links",
          links: [
            {
              text: "Centrifuge",
              url: "https://centrifuge.io/",
            },
            {
              text: "Harbor",
              url: "https://harbortrade.com/",
            },
          ],
        },
      ];
    default:
      return [
        {
          type: "text",
          text: "Coming soon.",
        },
      ];
  }
};

const VaultInfoScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<VaultParams, "VaultScreen">>();
  const vault = params.vault;
  const { name, image, description, color } = vault;
  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get("window").width;

  const apy = vault.chains
    ? averageApy(vault.chains.map((chain) => chain.apy)).toString()
    : "0";

  const info = getInfo(name);

  const LinkButton = ({ text, link }: any) => {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(link)}>
        <View className="flex-row items-center rounded-lg bg-primary-light p-1 pl-2 dark:bg-primary-dark">
          <Text className="text-typo-light dark:text-typo-dark">{text}</Text>
          <Image
            className="h-7 w-7"
            source={
              colorScheme === "light"
                ? require("../../assets/arrowupright.png")
                : require("../../assets/arrowupright_white.png")
            }
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="h-full bg-secondary-light py-6 dark:bg-secondary-dark">
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
      <ScrollView className="mx-auto mt-5 w-11/12 rounded-lg p-3">
        <View className="mb-6 flex-row justify-between">
          <View className="w-4/5">
            <Text className="mb-1 font-InterSemiBold text-3xl text-icon-special dark:text-secondary-light">
              {name}
            </Text>
            <Text className="text-[17px] text-typo-light dark:text-typo-dark">
              {description}
            </Text>
          </View>
          <Image className="h-12 w-12" source={{ uri: image }} />
        </View>
        {info ? (
          info.map((item, index) => {
            switch (item.type) {
              case "text":
                return (
                  <Text
                    key={index}
                    className="my-1 text-base leading-[22px] text-icon-special dark:text-secondary-light"
                  >
                    {item.text}
                  </Text>
                );
              case "apy":
                return (
                  <Text
                    key={index}
                    className="my-2 text-2xl font-bold text-typo-light dark:text-typo-dark"
                  >
                    Current APY: {apy}%
                  </Text>
                );
              case "image":
                return (
                  <View className="w-full" key={index}>
                    <Image
                      style={{
                        width: (windowWidth * 10) / 12,
                        resizeMode: "contain",
                      }}
                      className="mx-auto"
                      source={require("../../assets/glp-composition.png")}
                    />
                  </View>
                );
              case "links":
                return (
                  <View
                    className="my-4 mb-12 w-full flex-row justify-around"
                    key={index}
                  >
                    {item.links &&
                      item.links.map((link, indexTwo) => (
                        <LinkButton
                          text={link.text}
                          link={link.url}
                          key={indexTwo}
                        />
                      ))}
                  </View>
                );
            }
          })
        ) : (
          <Text className="my-1 text-typo-light dark:text-typo-dark">
            Coming soon...
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default VaultInfoScreen;
