/**
 * Wallet Addresses is a way to record additional wallet addresses for an MSA
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
        name: "coin_type",
        type: "int",
        doc: "Coin/Network using SLIP-004 registered coin types",
      },
      {
        name: "address",
        type: "string",
        doc: "The address as a string encoded in standard way for the given coin type",
      },
    ],
  },
};
