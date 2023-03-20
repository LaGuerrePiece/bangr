import "@ethersproject/shims";
import { ethers } from "ethers";
import tailwindConfig from "../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

const fullConfig = resolveConfig(tailwindConfig);
export const colors = fullConfig?.theme?.colors as any;

export const getURL = () =>
  process.env.NODE_ENV == "development"
    ? "http://localhost:3000"
    : "https://beta.poche.fi";

export const chainData = [
  {
    name: "Optimism",
    chainId: 10,
    image: "/optimism.png",
    logo: require("../../assets/optimism.png"),
    coingeckoIdentifier: "optimistic-ethereum",
    nativeTokenSymbol: "ETH",
    provider:
      process.env.DEV_MODE === "TRUE"
        ? new ethers.providers.JsonRpcProvider("http://127.0.0.1:10000/")
        : new ethers.providers.JsonRpcProvider(
            "https://opt-mainnet.g.alchemy.com/v2/nt_Vk273qpsz3qIEWkHi_ACuCXOXNdro"
          ),
    //https://optimism-mainnet.public.blastapi.io
    relayerFundRate: "0.001",
  },
  {
    name: "Arbitrum",
    chainId: 42161,
    image: "/arbitrum.png",
    logo: require("../../assets/arbitrum.png"),
    coingeckoIdentifier: "arbitrum-one",
    nativeTokenSymbol: "ETH",
    provider:
      process.env.DEV_MODE === "TRUE"
        ? new ethers.providers.JsonRpcProvider("http://127.0.0.1:10003/")
        : new ethers.providers.JsonRpcProvider(
            "https://arb-mainnet.g.alchemy.com/v2/nt_Vk273qpsz3qIEWkHi_ACuCXOXNdro"
          ),
    // or https://1rpc.io/arb or https://arb1.arbitrum.io/rpc
    relayerFundRate: "0.001",
  },
  {
    name: "Polygon",
    chainId: 137,
    image: "/polygon.png",
    logo: require("../../assets/polygon.png"),
    coingeckoIdentifier: "polygon-pos",
    nativeTokenSymbol: "MATIC",
    provider:
      process.env.DEV_MODE === "TRUE"
        ? new ethers.providers.JsonRpcProvider("http://127.0.0.1:10002/")
        : new ethers.providers.JsonRpcProvider(
            "https://polygon-mainnet.g.alchemy.com/v2/nt_Vk273qpsz3qIEWkHi_ACuCXOXNdro"
          ),
    //https://polygon-rpc.com
    relayerFundRate: "0.2",
  },
  // {
  //   name: "Binance Smart Chain",
  //   chainId: 56,
  //   image: "/bsc.png",
  //   nativeTokenSymbol : "BNB",
  //   coingeckoIdentifier: "binance-smart-chain",
  //   provider: process.env.DEV_MODE === "TRUE"
  //   ? new ethers.providers.JsonRpcProvider("http://127.0.0.1:10001/")
  //   : new ethers.providers.JsonRpcProvider("https://bsc-mainnet.public.blastapi.io")
  // },
] as const;

// alchemyProvider({ apiKey: 'VkrAJOLRBt1bb5p3ypYrQj84QElpex8g' }),
// infuraProvider({ apiKey: 'a035e52afe954afe9c45e781080cde98' }),
// infuraProvider({ apiKey: '099fc58e0de9451d80b18d7c74caa7c1' }),

export const TOKEN_WHITELIST = [
  "ETH",
  "MATIC",
  "WETH",
  "USDC",
  "USDT",
  "DAI",
  "WBTC",
  "RAI",
  "LINK",
  "aUSDC",
  "jEUR",
  // "QI",
  // "DHT",
  // "MKR",
  // "FRAX",
  // "CRV",
  // "HOP",
  // "STG",
  // "BIFI",
  // "BAL",
];

export const forceOnboarding = true;

// Threshold after which we consider it useless to try to complete
// a tuple in which the first term can to it alone
// because of the fixed cost of the additional tx
export const IGNORE_COMPLETE_THRESHOLD = 5;

// Limit of the number of source chains for an operation
// Temporary, to avoid overloading the APIs
export const SRC_CHAIN_LIMIT = 4;

export const TIME_VALID = 3600; // 1 hour

export const SWAP_DEBOUNCE_THRESHOLD = 1000; // 1 sec

export const SWAPAMOUNTIN_USD_THRESHOLD = 0.3; // 30 cents

// Wallet address used for quoting when the user is not connected
export const EXAMPLE_WALLET_ADDRESS =
  "0xE6E4b6a802F2e0aeE5676f6010e0AF5C9CDd0a50";

export const PAYMASTER_ADDRESS = "0xA5798D2F2618a24e017fc3631867a20a3fE8827b";

export const REFERENCE_CHAIN = 42161; // Arbitrum: reference chain used when a chain is needed

export const FEE_PER_CALL = 0.025; // Fee taken per call in dollars to pay gas
