import * as defaultTokenAddress from "./defaultTokenAddress.js";

export const schemas = new Map([
  [
    "defaultTokenAddress",
    {
      model: defaultTokenAddress,
      modelType: "AvroBinary",
      payloadLocation: "Itemized",
      settings: ["SignatureRequired"],
    },
  ],
]);
