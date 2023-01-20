import "@ethersproject/shims";
import { ethers } from "ethers";
import contractsConfig from "../config/contracts-config.json";
import { getChain } from "./utils";
import { Call, ContractsConfig, CallWithNonce } from "../types/types";
import walletLogicABI from "../config/abi/WalletLogic.json";

export async function addNonces(calls: Call[], smartWalletAddress: string) {
  const chainsOfCalls = [...new Set(calls.map((call) => call.cid))];
  let nonces: { [chainId: number]: number } = {};

  await Promise.all(
    chainsOfCalls.map(async (chainId) => {
      const chain = getChain(chainId);
      if (!(contractsConfig as ContractsConfig)[chainId].SWLogic) {
        console.log(`SWLogic not found in addNonces for chain ${chainId}`);
        return;
      }

      const code = await chain.provider.getCode(smartWalletAddress);

      if (code === "0x") {
        nonces[chainId] = 0;
      } else {
        try {
          nonces[chainId] = await new ethers.Contract(
            smartWalletAddress,
            walletLogicABI,
            chain.provider
          ).nonce();
        } catch (err) {
          console.log(`err during getNonce on chain ${chainId}`, err);
          throw err;
        }
      }
    })
  );

  let callsWithNounce: CallWithNonce[] = [];

  for (let i = 0; i < calls.length; i++) {
    const call = calls[i];
    callsWithNounce.push({
      ...call,
      nonce: nonces[call.cid],
    });
    nonces[call.cid]++;
  }

  // console.log('callsWithNounce', callsWithNounce)
  return callsWithNounce;
}
