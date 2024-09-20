import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { schemas } from "./schemas/index.js";

export const GENESIS_HASH_TESTNET_PASEO = "0x203c6838fc78ea3660a2f298a58d859519c72a5efdc0f194abd6f0d5ce1838e0";
export const GENESIS_HASH_MAINNET = "0x4a587bf17a404e3572747add7aab7bbe56e805a5479c6c436f07f36fcc8d3ae1";

// DEPLOY_SCHEMA_ENDPOINT_URL (environment variable)
// The value is a URL for the RPC endpoint.  e.g. ws://localhost:9944
export function getChainApi() {
  const DefaultWsProvider = new WsProvider(getEndpoint());

  return ApiPromise.create({
    provider: DefaultWsProvider,
    throwOnConnect: true,
  });
}

export function getEndpoint() {
  let DEPLOY_SCHEMA_ENDPOINT_URL = process.env.DEPLOY_SCHEMA_ENDPOINT_URL;
  if (DEPLOY_SCHEMA_ENDPOINT_URL === undefined) {
    // One would think that localhost would also work here but it doesn't consistently.
    DEPLOY_SCHEMA_ENDPOINT_URL = "ws://127.0.0.1:9944";
  }
  return DEPLOY_SCHEMA_ENDPOINT_URL;
}

// DEPLOY_SCHEMA_ACCOUNT_URI (environment variable)
// The value is a URI for the account.  e.g. //Alice or a mnemonic (seed words)
export const getSignerAccountKeys = () => {
  const keyring = new Keyring();

  let DEPLOY_SCHEMA_ACCOUNT_URI = process.env.DEPLOY_SCHEMA_ACCOUNT_URI;
  if (DEPLOY_SCHEMA_ACCOUNT_URI === undefined) {
    DEPLOY_SCHEMA_ACCOUNT_URI = "//Alice";
  }
  return keyring.addFromUri(DEPLOY_SCHEMA_ACCOUNT_URI, {}, "sr25519");
};

export const deploy = async () => {
  // Process arguments
  const args = process.argv.slice(2);

  let schemaNames = [];

  if (args.length == 0) {
    schemaNames = [...schemas.keys()];
  } else if (args.length > 0 && args.includes("help")) {
    console.log(
      [
        "Deploy Schemas Script",
        "",
        "Environment Variables:",
        "- DEPLOY_SCHEMA_ACCOUNT_URI",
        "- DEPLOY_SCHEMA_ENDPOINT_URL",
        "",
        'Example: DEPLOY_SCHEMA_ACCOUNT_URI="//Bob" DEPLOY_SCHEMA_ENDPOINT_URL="ws://127.0.0.1:9944" npm run deploy',
        "",
      ].join("\n"),
    );
    console.log("Available Schemas:\n-", [...schemas.keys()].join("\n- "));
    process.exit();
  } else if (args.length == 1) {
    // Does schema with name exist?
    const schemaName = args[0];
    const sc = schemas.get(schemaName);
    if (sc == undefined) {
      console.error("ERROR: No specified schema with name.");
      process.exit(1);
    } else {
      schemaNames = [schemaName];
    }
  } else {
    console.error("ERROR: You can only specify a single schema to create or all schemas if not specified.");
    process.exit(1);
  }

  console.log("Deploy of Schemas Starting...");

  const mapping = await createSchemas(schemaNames);
  console.log("Generated schema mapping:\n", JSON.stringify(mapping, null, 2));
};

// Given a list of events, a section and a method,
// returns the first event with matching section and method.
const eventWithSectionAndMethod = (events, section, method) => {
  const evt = events.find(({ event }) => event.section === section && event.method === method);
  return evt?.event;
};

// Given a list of schema names, attempt to create them with the chain.
const createSchemas = async (schemaNames) => {
  const promises = [];
  const api = await getChainApi();
  const signerAccountKeys = getSignerAccountKeys();
  // Mainnet genesis hash means we should propose instead of create
  const shouldPropose = api.genesisHash.toHex() === GENESIS_HASH_MAINNET;

  if (shouldPropose && schemaNames.length > 1) {
    console.error("Proposing to create schemas can only occur one at a time. Please try again with only one schema.");
    process.exit(1);
  }

  // Retrieve the current account nonce so we can increment it when submitting transactions
  const baseNonce = (await api.rpc.system.accountNextIndex(signerAccountKeys.address)).toNumber();

  for (const idx in schemaNames) {
    const schemaName = schemaNames[idx];
    const nonce = baseNonce + Number(idx);

    console.log("Attempting to create " + schemaName + " schema.");

    // Get the schema from the name
    const schemaDeploy = schemas.get(schemaName);
    if (!schemaDeploy) throw `Unknown Schema name: ${schemaName}`;
    // Create JSON from the schema object
    const json = JSON.stringify(schemaDeploy?.model);
    // Remove whitespace in the JSON
    const json_no_ws = JSON.stringify(JSON.parse(json));

    if (shouldPropose) {
      // Propose to create
      const promise = new Promise((resolve, reject) => {
        api.tx.schemas
          .proposeToCreateSchemaV2(
            json_no_ws,
            schemaDeploy.modelType,
            schemaDeploy.payloadLocation,
            schemaDeploy.settings,
            "frequency." + schemaName,
          )
          .signAndSend(signerAccountKeys, { nonce }, ({ status, events, dispatchError }) => {
            if (dispatchError) {
              console.error("ERROR: ", dispatchError.toHuman());
              console.log("Might already have a proposal with the same hash?");
              reject(dispatchError.toHuman());
            } else if (status.isInBlock || status.isFinalized) {
              const evt = eventWithSectionAndMethod(events, "council", "Proposed");
              if (evt) {
                const id = evt?.data[1].toString();
                const hash = evt?.data[2].toHex();
                console.log("SUCCESS: " + schemaName + " schema proposed with id of " + id + " and hash of " + hash);
                resolve([schemaName, id]);
              } else {
                const err = "Proposed event not found";
                console.error(`ERROR: ${err}`);
                reject(err);
              }
            }
          });
      });
      promises[idx] = promise;
    } else {
      // Create directly via sudo
      const tx = api.tx.schemas.createSchemaViaGovernanceV2(
        signerAccountKeys.address,
        json_no_ws,
        schemaDeploy.modelType,
        schemaDeploy.payloadLocation,
        schemaDeploy.settings,
        "frequency." + schemaName,
      );
      const promise = new Promise((resolve, reject) => {
        api.tx.sudo.sudo(tx).signAndSend(signerAccountKeys, { nonce }, ({ status, events, dispatchError }) => {
          if (dispatchError) {
            console.error("ERROR: ", dispatchError.toHuman());
            reject(dispatchError.toHuman());
          } else if (status.isInBlock || status.isFinalized) {
            const evt = eventWithSectionAndMethod(events, "schemas", "SchemaCreated");
            if (evt) {
              const id = evt?.data[1].toString();
              console.log("SUCCESS: " + schemaName + " schema created with id of " + id);
              resolve([schemaName, id]);
            } else {
              const err = "SchemaCreated event not found";
              console.error(`ERROR: ${err}`);
              reject(err);
            }
          }
        });
      });
      promises[idx] = promise;
    }
  }
  const output = await Promise.all(promises);
  const mapping = {};
  mapping[api.genesisHash.toString()] = Object.fromEntries(output);
  return mapping;
};

export const main = async () => {
  await deploy();
};

main().catch(console.error).finally(process.exit);
