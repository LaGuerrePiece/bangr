import { LifiQuote, SingleQuote } from "../types/types";

export type LifiData = {
  fromChainId: number;
  fromAmount: string;
  fromTokenAddress: string;
  toChainId: number;
  toTokenAddress: string;
  fromAddress: string;
  toAddress?: string;
};

export async function getLifiQuote(
  lifiData: LifiData
): Promise<LifiQuote | undefined> {
  const {
    fromChainId,
    fromAmount,
    fromTokenAddress,
    toChainId,
    toTokenAddress,
    fromAddress,
    toAddress,
  } = lifiData;
  try {
    // prettier-ignore
    // @ts-ignore
    const response = await fetch(`https://li.quest/v1/quote?` + new URLSearchParams({
          fromChain: fromChainId,
          toChain: toChainId,
          fromToken: fromTokenAddress,
          toToken: toTokenAddress,
          fromAmount: fromAmount,
          fromAddress: fromAddress,
          toAddress: toAddress ?? fromAddress,
          slippage: 0.2,
          denyBridges: "stargate",
        })
    );
    const quote = await response.json();
    console.log("quote", quote);

    if (
      quote.errors ||
      quote.message ===
        "An unknown error occurred. Please seek assistance in the LI.FI discord server." ||
      quote.message === "Unknown token symbol or address passed"
    ) {
      return;
    }

    return {
      type: "lifi",
      fromToken: quote.action.fromToken,
      fromAmount: quote.action.fromAmount,
      fromAmountUSD: quote.estimate.fromAmountUSD,
      toAmount: quote.estimate.toAmount,
      toAmountUSD: quote.estimate.toAmountUSD,
      gasCostUSD: quote.estimate.gasCosts
        .reduce(
          (partialSum: any, gasCost: any) =>
            partialSum + Number(gasCost.amountUSD),
          0
        )
        .toString(),
      transactionRequest: quote.transactionRequest,
    };
  } catch (err) {
    throw err;
  }
}
