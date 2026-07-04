# degenite-sdk (community, unofficial)

A small, dependency-free TypeScript/JavaScript client for talking to the
public HTTP surface of a DEGENITE-style trading API: wallet auth, positions,
buy/sell, and mode switching.

This package is a **thin transport wrapper only**. It does not include, and
has no access to, the server-side scoring, risk, or execution engine — those
stay private to whoever runs the actual instance. This SDK is only useful if
you (or someone you trust) already run a compatible backend and want a
typed client to build tools against it.

## Install

```bash
npm install degenite-sdk
```

## Usage

```ts
import { DegeniteClient } from "degenite-sdk";

const client = new DegeniteClient({ baseUrl: "https://your-instance.example.com" });

// 1. Get a nonce/message to sign with your Solana wallet
const { message, nonce } = await client.requestNonce(walletAddress);

// 2. Sign `message` with your wallet (e.g. via @solana/wallet-adapter) and verify
const session = await client.verify({ walletAddress, signature, nonce });

// 3. Use the session cookie transparently for subsequent calls
const { positions, portfolio } = await client.getPositions();

await client.buy({ chain: "sol", address: tokenMint, sizeSol: 0.05 });
await client.sell({ address: tokenMint });
```

## Build

```bash
npm install
npm run build
```

## Scope & disclaimer

- This is a community/unofficial client, not an official DEGENITE release.
- It does not embed any trading strategy, risk parameters, or private keys.
- You are responsible for pointing it at an API you trust and for any trades
  it executes on your behalf.
