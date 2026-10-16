# Smart-Scan: Web3 Smart Contract Metadata Viewer

This project retrieves verified contract metadata for BNB Smart Chain addresses. It is **not a vulnerability scanner** and does not produce a security risk score.

## Run locally

1. Install Node.js 20 or later.
2. Copy `.env.example` to `.env`.
3. Add your own BscScan API key to `BSC_API_KEY`. Add `MORALIS_API_KEY` if wallet-balance lookup is desired.
4. Install dependencies with `npm install`.
5. Start the app with `npm start` and open `http://localhost:3000`.

API keys are read by the Node server and are not embedded in frontend JavaScript. Never commit `.env` or real credentials. If a key was committed in an earlier version, revoke/rotate it.

## Scope and limitations

- Validates EVM address format and fetches contract metadata using the Etherscan API v2 for chain ID 56.
- Shows whether verified source code is available and displays compiler metadata.
- Wallet balance is optional and depends on Moralis API configuration.
- No bytecode/source vulnerability analysis is performed. Do not treat metadata or verification status as a security audit.
