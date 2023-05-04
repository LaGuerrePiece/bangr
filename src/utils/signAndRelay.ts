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
import { Task } from "../types/types";


// const getTasks = async (scwAddress: string) => {
//   try {
//     const { data } = (await axios.post(
//       `${getURLInApp()}/api/v1/tasks`,
//       scwAddress,
//       {
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json; charset=UTF-8",
//         },
//       }
//     )) as { data: Task[] };
//     return data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.log("error relaying transaction: ", error.message);
//     } else {
//       console.log("unexpected error relaying transaction: ", error);
//     }
//   }
// };

export const relay = async (
  calls: CallWithNonce[],
  wallet: ethers.Wallet,
  scwAddress: string,
  value: string,
  type: string,
  protocol: string,
  asset1: string,
  asset2: string,
  amount: string,
  successMessage: string,
  errorMessage: string
) => {
  // Toast.show({
  //   type: "info",
  //   text1: "Transaction sent",
  //   text2: "Waiting for confirmation...",
  // });

  const callsObject = {
    Calls: calls,
  };

  const signature = await wallet._signTypedData(
    signTypedDataDomain,
    signTypedDataTypes,
    callsObject
  );

  const deployRes = await deployWalletsIfNotDeployed(
    [...new Set(calls.map((c) => c.cid))],
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

  console.log("sendTx", calls);
  const relayResponse = await sendTx({
    signature,
    data: callsObject,
    value,
    senderEOA: wallet.address,
    scwAddress: scwAddress,
    type,
    asset1,
    asset2,
    amount,
    protocol,
  });
  console.log("relayResponse", relayResponse);

  if (!relayResponse || relayResponse.error) {
    Toast.show({
      type: "error",
      text1: "error relaying transaction",
    });
    return;
  }

  console.log("Success. relayResponse :", relayResponse);

  // until the cron
  // const ping = await axios.get(`${getURLInApp()}/api/v1/tRelay`);
  // console.log("cron called", ping);

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

  // get user tasks by making a request to the tasks api every 5 seconds and check if this tx has state 2
  // if yes, show success toast

  // let task;
  // do {
  //   const tasks = await getTasks(scwAddress);
  //   task = tasks!.find((t) => t.signature == signature);
  //   console.log("task", task?.state);
  //   if (task && task.state === 2) {
  //     Toast.show({
  //       type: "success",
  //       text1: successMessage,
  //     });
  //     console.log("success");
  //     // fetchBalances(smartWalletAddress);
  //     // fetchVaults(smartWalletAddress);
  //     return;
  //   }
  //   // wait 2.5 seconds
  //   await new Promise((r) => setTimeout(r, 2500));
  // } while (!task || task.state !== 2);

  // const ping = setInterval(() => {
  //   getTasks(scwAddress).then((tasks) => {
  //     const task = tasks!.find((t) => t.signature == signature);
  //     console.log("task", task?.state);
  //     if (task && task.state === 2) {
  //       Toast.show({
  //         type: "success",
  //         text1: successMessage,
  //       });
  //       console.log("success");
  //       // fetchBalances(smartWalletAddress);
  //       // fetchVaults(smartWalletAddress);
  //       clearTimeout(ping);
  //       return;
  //     }
  //   });
  // }, 2500);

  // Toast.show({
  //   type: "success",
  //   text1: successMessage,
  // });
};

const sendTx = async (body: {
  signature?: string;
  data?: { Calls: CallWithNonce[] };
  value?: string;
  senderEOA: string;
  scwAddress?: string;
  type?: string;
  asset1?: string;
  asset2?: string;
  amount?: string;
  protocol?: string;
}) => {
  try {
    const { data } = (await axios.post(`${getURLInApp()}/api/v1/sendTx`, body, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
      },
    })) as { data: RelayerResponse };
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error sending tx: ", error.message);
    } else {
      console.log("unexpected error sending tx: ", error);
    }
  }
};

const sendToRelayer = async (body: {
  signature?: string;
  data?: { Calls: CallWithNonce[] };
  value?: string;
  senderEOA: string;
  deploy?: ChainId[];
  scwAddress?: string;
  type?: string;
  asset1?: string;
  asset2?: string;
  amount?: string;
  protocol?: string;
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

export const deployWalletsIfNotDeployed = async (
  chainsToCheck: ChainId[],
  senderEOA: string,
  scwAddress: string
) => {
  const chainsOnWhichToDeploy: ChainId[] = [];

  await Promise.all(
    chainsToCheck.map(async (chainId) => {
      const provider = getChain(chainId).provider;
      if ((await provider.getCode(scwAddress)) === "0x") {
        chainsOnWhichToDeploy.push(chainId);
      }
    })
  );
  if (chainsOnWhichToDeploy.length === 0) return;

  const res = await sendToRelayer({
    deploy: chainsOnWhichToDeploy,
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
