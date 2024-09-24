import { expect, test, it } from "vitest";
import avro from "avsc";
import defaultTokenAddress from "./defaultTokenAddress.js";

test("Token Addresses Schema is Avro", () => {
  const schema = avro.Type.forSchema(defaultTokenAddress);
  expect(schema).toBeDefined();
});

test("Token Addresses Schema can take the correct data", () => {
  const schema = avro.Type.forSchema(defaultTokenAddress);
  const dot = schema.toBuffer({
    token_slip_0044: 354,
    address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  });
  expect(dot).toBeDefined();
  expect(schema.fromBuffer(dot).token_slip_0044).toBe(354);

  const btc = schema.toBuffer({
    token_slip_0044: 0,
    address: "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo",
  });
  expect(btc).toBeDefined();
  expect(schema.fromBuffer(btc).token_slip_0044).toBe(0);
});
