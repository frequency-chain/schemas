import { expect, test, it } from "vitest";
import avro from "avsc";
import paymentAddresses from "./paymentAddress.js";

test("Payment Addresses Schema is Avro", () => {
  const schema = avro.Type.forSchema(paymentAddresses);
  expect(schema).toBeDefined();
});

test("Payment Addresses Schema can take the correct data", () => {
  const schema = avro.Type.forSchema(paymentAddresses);
  const dot = schema.toBuffer({
    coin_type: 354,
    address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  });
  expect(dot).toBeDefined();
  expect(schema.fromBuffer(dot).coin_type).toBe(354);

  const btc = schema.toBuffer({
    coin_type: 0,
    address: "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo",
  });
  expect(btc).toBeDefined();
  expect(schema.fromBuffer(btc).coin_type).toBe(0);
});
