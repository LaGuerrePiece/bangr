export const signTypedDataTypes = {
  Calls: [{ name: "Calls", type: "Call[]" }],
  Call: [
    { name: "to", type: "address" },
    { name: "cid", type: "uint32" },
    { name: "deadline", type: "uint256" },
    { name: "value", type: "uint256" },
    { name: "gas", type: "uint256" },
    { name: "callData", type: "bytes" },
    { name: "nonce", type: "uint256" },
  ],
};

export const signTypedDataDomain = {
  name: "Poche",
  version: "1",
  chainId: "1",
};
