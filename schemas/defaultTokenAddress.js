/**
 * Token Address is a way to record a token sending and receiving addresses for an MSA
 * Should be stored using Itemized and Signature Required
 * SLIP-0044 Standard: https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 */
export default {
  type: "record",
  name: "DefaultTokenAddress",
  namespace: "frequency",
  fields: [
    {
      name: "token_slip_0044",
      type: "int",
      doc: "Network for this token address using SLIP-0044 registered coin type integers",
    },
    {
      name: "address",
      type: "string",
      doc: "The address as a string encoded in standard way for the given coin type",
    },
  ],
};
