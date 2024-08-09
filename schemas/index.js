import * as paymentAddress from "./paymentAddress.js";

export const schemas = new Map([
  [
    "paymentAddress",
    {
      model: paymentAddress,
      modelType: "AvroBinary",
      payloadLocation: "Itemized",
      settings: ["SignatureRequired"],
    },
  ],
]);
