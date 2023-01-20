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
};

export type Balances = {
  chainId: ChainId;
  symbol: string;
  balance?: string;
  priceUSD?: number;
  quote?: number;
};

export type TokenGroup = {
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
  logoURI: string;
  tokens: [];
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
  sumOfToAmount?: BigNumber;
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
