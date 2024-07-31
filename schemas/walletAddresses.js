/**
 * Wallet Address is a way to record additional wallet addresses for an MSA
 * Should be stored using Itemized and Signature Required
 * SLIP-0044 Standard: https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 */
export default {
  type: "record",
  name: "Address",
  namespace: "xyz.frequency",
  fields: [
    {
      name: "coin_type",
      type: "int",
      doc: "Coin/Network using SLIP-0044 registered coin type integers",
    },
    {
      name: "address",
      type: "string",
      doc: "The address as a string encoded in standard way for the given coin type",
    },
  ],
};
