import Constants from "expo-constants";
import "@ethersproject/shims";
import { BigNumber, ethers } from "ethers";
import { chainData, FEE_PER_CALL, REFERENCE_CHAIN } from "../config/configs";
import {
  CallWithNonce,
  ChainData,
  ChainId,
  MultichainToken,
  Token,
  Quote,
  ContractsConfig,
  Balance,
  Price,
} from "../types/types";
import contractsConfig from "../config/contracts-config.json";
import walletFactoryAbi from "../config/abi/WalletFactory.json";

interface TokenWithBalanceAndLifi extends TokenWithBalanceInBn {
  amountToConsider: BigNumber;
}

interface TokenWithBalanceInBn extends Omit<Token, "balance"> {
  balance: BigNumber;
}

export function getChain(chainId: ChainId) {
  return chainData.find((chain) => chain.chainId === chainId) as ChainData;
}

// if the user is not connected, returns example balances
// that have enough of the needed token for the swap to be quoted
export function getExampleMultichainToken(
  srcToken: MultichainToken,
  swapAmountIn: string
): MultichainToken {
  const balance = ethers.utils
    .parseUnits(
      BigNumber.from(swapAmountIn).mul(2).toString(),
      srcToken.decimals
    )
    .toString();

  return {
    name: srcToken.name,
    symbol: srcToken.symbol,
    decimals: srcToken.decimals,
    logoURI: srcToken.logoURI,
    balance: balance,
    quote: 10000,
    priceUSD: 1,
    chains: [
      {
        chainId: srcToken.chains[0].chainId,
        address: srcToken.chains[0].address,
        decimals: srcToken.decimals,
        balance: balance,
        quote: 10000,
        priceUSD: 1,
      },
    ],
  };
}

// Merges Token array into multichain tokens, based on tokenSymbols
// TODO : support different tokens with the same symbol
export function mergeTokens(tokens: Token[]): MultichainToken[] {
  let mergedArray: MultichainToken[] = [];
  for (const token of tokens) {
    const index = mergedArray.findIndex(
      (mergedToken) => mergedToken.symbol === token.symbol
    );
    if (index >= 0) {
      mergedArray[index].chains.push({
        chainId: token.chainId,
        address: token.address,
        decimals: token.decimals,
      });

      mergedArray[index].name = shortestName(
        mergedArray[index].name,
        token.name
      );
    } else {
      mergedArray.push({
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        logoURI: token.logoURI,
        chains: [
          {
            chainId: token.chainId,
            address: token.address,
            decimals: token.decimals,
          },
        ],
      });
    }
  }

  // for now, keep only those that are on all 3 chains
  return mergedArray.sort((a, b) => Number(b.balance) - Number(a.balance));

  // return mergedArray.filter(token => {
  //   return (token.chains[10] && token.chains[137] && token.chains[42161]) || ["ETH", "MATIC"].includes(token.symbol)
  // })
}

export function shortestName(firstName: string, secondName: string) {
  return firstName.length > secondName.length ? secondName : firstName;
}

export function getCorrectedAmountIn(
  amountIn: string,
  token: MultichainToken | TokenWithBalanceAndLifi
) {
  if (token.priceUSD === undefined || token.priceUSD === 0) {
    throw { message: "tokenToPayGasIn price is undefined" };
  }

  const numberOfCalls = ["ETH", "MATIC"].includes(token.symbol) ? 1 : 2;
  const amountToPay = ethers.utils.parseUnits(
    ((numberOfCalls * FEE_PER_CALL * 1.05) / token.priceUSD)
      .toFixed(token.decimals)
      .toString(),
    token.decimals
  );

  const correctedAmountIn = BigNumber.from(amountIn)
    .sub(amountToPay)
    .toString();
  console.log("amountIn", amountIn, "correctedAmountIn :", correctedAmountIn);
  return correctedAmountIn;
}

export function getRelayerValueToSend(quote: Quote) {
  let valueToSend = BigNumber.from(0);

  for (const singleQuote of quote.singleQuotes) {
    if (singleQuote.type === "lifi") {
      valueToSend = valueToSend.add(
        singleQuote.transactionRequest.value ?? "0"
      );
      if (
        singleQuote.fromToken.symbol === "ETH" ||
        singleQuote.fromToken.symbol === "MATIC"
      ) {
        valueToSend = valueToSend.sub(BigNumber.from(singleQuote.fromAmount));
      }
    }
  }

  return valueToSend.toString();
  // we can sum the txRequest.value because if they don't come from lifi, they are 0 for now
  // return quote.singleQuotes.reduce(
  //   (partialSum, a) => partialSum.add(BigNumber.from(a.transactionRequest.value ?? "0")),
  //   BigNumber.from(0)
  // ).toString()
}

export function getDestChains(calls: CallWithNonce[]) {
  return [...new Set(calls.map((call) => call.cid))];
}

export function allChainIds() {
  return chainData.map((chain) => chain.chainId);
}

export async function getSmartWalletAddress(eoa: string) {
  const chain = getChain(REFERENCE_CHAIN);
  const SWFactoryAddress = (contractsConfig as ContractsConfig)?.[
    REFERENCE_CHAIN
  ]?.SWFactory;

  if (!SWFactoryAddress) {
    console.log("SWFactory deployment address not found");
    return;
  }

  const factory = new ethers.Contract(
    SWFactoryAddress,
    walletFactoryAbi,
    chain.provider
  );

  const scwAddress = await factory.getWalletAddress(eoa);

  console.log("smartWalletAddress:", scwAddress);

  return scwAddress;
}

export function addBalancesToTokens(
  tokens: MultichainToken[],
  balances: Balance[]
) {
  //keep this weird map to update the components
  const newTokens: MultichainToken[] = tokens.map((token) => token);

  balances.forEach((balance) => {
    if (!balance.balance) return;

    const token = newTokens.find((token) => token.symbol === balance.symbol);
    const chain = token?.chains.find(
      (chain) => chain.chainId === balance.chainId
    );
    if (!token || !chain) return;

    chain.balance = balance.balance;
    chain.quote =
      Number(ethers.utils.formatUnits(balance.balance, token.decimals)) *
      (chain.priceUSD ?? 0);
  });

  newTokens.map((token) => {
    token.balance = token.chains.reduce(
      (partialSum, chain) =>
        BigNumber.from(partialSum)
          .add(BigNumber.from(chain.balance ?? "0"))
          .toString(),
      "0"
    );
    token.quote = token.chains.reduce(
      (partialSum, chain) => partialSum + (chain.quote ?? 0),
      0
    );
  });

  return newTokens.sort((a, b) => Number(b.quote) - Number(a.quote));
}

export function addPricesToTokens(tokens: MultichainToken[], prices: Price[]) {
  //keep this weird map to update the components
  const newTokens: MultichainToken[] = tokens.map((token) => token);

  prices.forEach((price) => {
    if (!price.priceUSD) return;

    const token = newTokens.find((token) => token.symbol === price.symbol);
    const chain = token?.chains.find(
      (chain) => chain.chainId === price.chainId
    );
    if (!token || !chain) return;

    chain.priceUSD = price.priceUSD;
    chain.quote =
      Number(ethers.utils.formatUnits(chain.balance ?? 0, token.decimals)) *
      price.priceUSD;
  });

  newTokens.map((token) => {
    token.priceUSD = token.chains[0].priceUSD ?? token.priceUSD;
    token.quote = token.chains.reduce(
      (partialSum, chain) => partialSum + (chain.quote ?? 0),
      0
    );
  });

  return newTokens.sort((a, b) => Number(b.quote) - Number(a.quote));
}

export function getChainWithMaxBalance(chains: MultichainToken["chains"]) {
  const chain = chains.reduce((max, chain) =>
    Number(chain.balance ?? 0) > Number(max.balance ?? 0) ? chain : max
  );
  return getChain(chain.chainId);
}

export const getURLInApp = () =>
  process.env.NODE_ENV == "development"
    ? `http://${Constants.manifest?.debuggerHost?.split(":").shift()}:3000`
    : "https://dev.poche.fi";
  // "https://dev.poche.fi";

export const correctInput = (input: string): string => {
  return input.replace(/,/g, ".");
};

export const etherscanLink = (chainId: number, hash: string) => {
  // url is polygonscan.io for chain id 137
  // arbiscan.io for chain id 42161
  // optimistic.etherscan.io for chain id 10
  const url = chainId === 137 ? "https://polygonscan.com" : chainId == 42161 ?  "https://arbiscan.io" : "https://optimistic.etherscan.io";
  return `${url}/tx/${hash}`;
};
