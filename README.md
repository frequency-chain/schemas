# Frequency Schemas

Some generic schemas for improving the usability of Frequency

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
