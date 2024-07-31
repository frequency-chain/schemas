import * as walletAddresses from "./walletAddresses.js";

export const schemas = new Map([
  [
    "walletAddresses",
    {
      model: walletAddresses,
      modelType: "AvroBinary",
      payloadLocation: "Itemized",
      settings: ["SignatureRequired"],
    },
  ],
]);
