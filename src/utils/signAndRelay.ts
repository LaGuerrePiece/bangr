import "@ethersproject/shims";
import { ethers } from "ethers";
import {
  CallWithNonce,
  ChainId,
  ContractsConfig,
  RelayerResponse,
} from "../types/types";
import { getChain } from "../utils/utils";
import axios from "axios";
import { getURLInApp } from "./utils";
import {
  signTypedDataTypes,
  signTypedDataDomain,
} from "../config/signTypedData";
import Toast from "react-native-toast-message";

export const relay = async (
  calls: CallWithNonce[],
  wallet: ethers.Wallet,
  scwAddress: string,
  value: string,
  successMessage: string,
  errorMessage: string
) => {
  Toast.show({
    type: "info",
    text1: "Transaction sent",
    text2: "Waiting for confirmation...",
  });

  const callsObject = {
    Calls: calls,
  };

  const signature = await wallet._signTypedData(
    signTypedDataDomain,
    signTypedDataTypes,
    callsObject
  );

  const deployRes = await deployWalletsIfNotDeployed(
    calls,
    wallet.address,
    scwAddress
  );

  if (deployRes === "error") {
    Toast.show({
      type: "error",
      text1: "error deploying wallet",
    });
    return;
  }

  const relayResponse = await sendToRelayer({
    signature,
    data: callsObject,
    senderEOA: wallet.address,
    value,
  });

  if (!relayResponse) {
    Toast.show({
      type: "error",
      text1: "error relaying transaction",
    });
    return;
  }

  console.log("Success. relayResponse :", relayResponse);

  const txSuccesses: boolean[] = [];
  //the following part is dirty and will change when the relayer is updated
  await Promise.all(
    Object.keys(relayResponse).map(async (cid: string) => {
      const chainId = Number(cid) as ChainId;
      const tx = relayResponse[chainId];

      if (tx.error) {
        Toast.show({
          type: "error",
          text1: `error relaying transaction on ${getChain(chainId).name}`,
        });
        txSuccesses.push(false);
        return;
      }

      let txFound;
      do {
        txFound = await getChain(chainId).provider.getTransaction(tx.hash!);
        await new Promise((r) => setTimeout(r, 750));
      } while (!txFound);

      console.log(`tx ${tx.hash} found on chain ${chainId}`);

      await txFound.wait();

      console.log(`tx ${tx.hash} mined.`);

      txSuccesses.push(true);
    })
  );

  if (txSuccesses.includes(false)) return;
  Toast.show({
    type: "success",
    text1: successMessage,
  });
};

const sendToRelayer = async (body: {
  signature?: string;
  data?: { Calls: CallWithNonce[] };
  value?: string;
  senderEOA: string;
  deploy?: ChainId[];
  scwAddress?: string;
}) => {
  try {
    const { data } = (await axios.post(`${getURLInApp()}/api/v1/relay`, body, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
      },
    })) as { data: RelayerResponse };
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error relaying transaction: ", error.message);
    } else {
      console.log("unexpected error relaying transaction: ", error);
    }
  }
};

const deployWalletsIfNotDeployed = async (
  calls: CallWithNonce[],
  senderEOA: string,
  scwAddress: string
) => {
  const chainsToCheck = [...new Set(calls.map((c) => c.cid))];
  const chainsOnWhichTODeploy: ChainId[] = [];

  await Promise.all(
    chainsToCheck.map(async (chainId) => {
      const provider = getChain(chainId).provider;
      if ((await provider.getCode(scwAddress)) === "0x") {
        chainsOnWhichTODeploy.push(chainId);
      }
    })
  );
  if (chainsOnWhichTODeploy.length === 0) return;

  const res = await sendToRelayer({
    deploy: chainsOnWhichTODeploy,
    senderEOA: senderEOA,
  });

  if (!res || Object.values(res).some((res) => res.error)) {
    console.log("Error sending deployment tx. res :", res);
    return "error";
  }

  await Promise.all(
    Object.keys(res).map(async (cid: string) => {
      const chainId = Number(cid) as ChainId;
      const tx = res[chainId];

      if (tx.error) {
      } else {
        let txFound;
        do {
          txFound = await getChain(chainId).provider.getTransaction(tx.hash!);
          await new Promise((r) => setTimeout(r, 750));
        } while (!txFound);

        console.log(`tx ${tx.hash} found on chain ${chainId}`);
        await txFound.wait();
        console.log(`tx ${tx.hash} mined.`);

        Toast.show({
          type: "success",
          text1: `Smart Wallet deployed on ${getChain(chainId).name}.`,
        });
      }
    })
  );
};
