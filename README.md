# Frequency Schemas

Some generic schemas for improving the usability of Frequency

## Schemas

### Default Token Address

- Mainnet Schema Name: `frequency.default-token-address`
- Mainnet Schema Id: 21
- Goal: Allow MSAs to list their default token sending and receiving addresses, both from Frequency and other chains
- Payload Location Options
    - Itemized: Each piece of data is atomic
    - Signature Required: Creating or removing connecting addresses should require user sign-off

#### Data

- Address: String form of the token address for the specific chain
- Token: SLIP-0044 Chain Identifier

#### References

- [SLIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)

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

e.g. To register the "default-token-address" schema

    npm run deploy default-token-address

**Note:** Requires a sudo key if deploying to a testnet.
Mainnet will use the proposal system (`proposeToCreateSchema`).

## Additional Tools

## Help

```sh
npm run deploy help
```
