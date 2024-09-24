import * as defaultTokenAddress from "./defaultTokenAddress.js";

export const schemas = new Map([
  [
    "default-token-address",
    {
      model: defaultTokenAddress,
      modelType: "AvroBinary",
      payloadLocation: "Itemized",
      settings: ["SignatureRequired"],
    },
  ],
]);
