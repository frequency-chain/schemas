# Frequency Schemas

Some generic schemas for improving the usability of Frequency

## Schemas

### Wallet Addresses

- Goal: Allow MSAs to list their wallet addresses, both from Frequency and other chains
- Payload Location Options
    - OnChain / IPFS: No. This is user-centric data that needs to be discovered via an MSA Id
    - Paginated: Likely? The data is one "page" of data not individual atoms
    - Itemized: Possible. We could structure the data as a list instead of a page. Then this makes more sense, but is perhaps harder to ensure it is up to date due to less cleanup

#### Data

- Chain Information
    - Chain Link Id?
    - Genesis Hash?

#### References

- https://chainlist.org

## Use to Deploy Schemas

### Setup

1. Pull the repository
1. Install dependencies `npm install`

## Usage

### To deploy/register all schemas

```sh
npm run deploy
```

by default it will deploy to the `localhost` node on port 9944 using the Alice sudo test account.

Two environment variables allow you to change these defaults:

```sh
DEPLOY_SCHEMA_ACCOUNT_URI="//Alice"
DEPLOY_SCHEMA_ENDPOINT_URL="ws://localhost:9944"
```

e.g.

```sh
DEPLOY_SCHEMA_ACCOUNT_URI="//Bob" DEPLOY_SCHEMA_ENDPOINT_URL="ws://127.0.0.1:9944" npm run deploy profile
```

### To register a single schema

e.g. To register the "walletAddresses" schema

    npm run deploy walletAddresses

**Note:** Requires a sudo key if deploying to a testnet.
Mainnet will use the proposal system (`proposeToCreateSchema`).

## Additional Tools

## Help

```sh
npm run deploy help
```
