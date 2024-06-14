import { expect, test, it } from "vitest";
import avro from "avro-js";
import walletAddresses from "./walletAddresses.js";

test("Wallet Addresses Schema is Avro", () => {
  const parsed = avro.parse(walletAddresses);
  expect(parsed).toBeDefined();
});
