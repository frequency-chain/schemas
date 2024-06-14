/**
 * Wallet Addresses is a way to record wallet addresses for an MSA
 */
export default {
  type: "array",
  name: "walletAddresses",
  namespace: "xyz.frequency",
  items: {
    type: "record",
    name: "Address",
    fields: [
      {
        name: "network",
        type: "string",
        doc: "Network the address is associated with",
      },
      {
        name: "address",
        type: "string",
        doc: "The address",
      },
    ],
  },
};
