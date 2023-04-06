import "@ethersproject/shims";
import { BigNumber, UnsignedTransaction } from "ethers";
import { chainData } from "../config/configs";

export type ContractsConfig = {
  [chainId: string]: {
    [contractName: string]: string;
  };
};

export type ChainData = (typeof chainData)[number];

export type ChainId = ChainData["chainId"];

// Basic token type from uniswap list
export interface Token {
  chainId: ChainId;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
  priceUSD?: number;
  quote?: number;
}

// Most common type
export type MultichainToken = Omit<Token, "chainId" | "address"> & {
  chains: {
    chainId: ChainId;
    address: string;
    decimals: number;
    balance?: string;
    quote?: number;
    priceUSD?: number;
  }[];
  color?: string;
};

export type Balance = {
  chainId: ChainId;
  symbol: string;
  balance?: string;
};

export type Price = {
  chainId: ChainId;
  symbol: string;
  priceUSD?: number;
};

export type Call = {
  to: string;
  cid: ChainId;
  deadline: number;
  value: BigNumber;
  gas: number;
  callData: string;
};

export interface CallWithNonce extends Call {
  nonce: number;
}

export type RelayerResponse = {
  [key: string]: {
    hash?: string;
    deployment?: boolean;
    error?: boolean;
  };
};

export type Quote = {
  singleQuotes: SingleQuote[];
  sumOfToAmount?: string;
  totalToAmountUSD?: Number;
  totalFromAmountUSD?: Number;
};

export type SingleQuote = LifiQuote | TransferQuote;

export type LifiQuote = {
  type: "lifi";
  fromToken: Token;
  fromAmount: string;
  fromAmountUSD: string;
  toAmount: string;
  toAmountUSD: string;
  gasCostUSD: string;
  transactionRequest: UnsignedTransaction;
};

export type TransferQuote = {
  type: "transfer";
  fromToken: Token;
  fromAmount: string;
  fromAmountUSD: string;
  toAddress: string;
  toAmount: string;
  toAmountUSD: string;
  gasCostUSD: string;
  transactionRequest: UnsignedTransaction;
};

export enum VaultProtocol {
  AAVE = "Aave",
  ROCKET_POOL = "Rocket Pool",
  GMX = "GMX",
  VELODROME = "Velodrome",
  JonesETH = "SushiSwap",
  Harbor = "Harbor",
  JonesGLP = "JonesDAO",
  Ondo = "FluxFinance",
}

export enum Volatility {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  DEGEN = "Degen",
}

export interface VaultStatic {
  name: string;
  image: string;
  description: string;
  longDescription?: string;
  vaultToken?: string;
  tokens: string[];
  currency?: string;
  currencyIcon?: string;
  protocol: VaultProtocol;
  volatility?: Volatility;
  status: "active" | "inative" | "preview";
  color?: string;
}

export interface VaultData extends VaultStatic {
  chains: {
    chainId?: number;
    deposited: string;
    apy: number;
    tvl: number;
  }[];
}
