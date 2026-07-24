# InventoryChain — Frontend

A React + Vite + Tailwind + ethers.js v6 dashboard for the **already-deployed**
`InventoryFactory` / `Product` smart contracts on Ethereum Sepolia. This
project contains **no Solidity** — it is a pure frontend that talks to
contracts you deployed yourself via Remix.

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Copy `.env.example` to `.env` (already done for you) and fill in:

```bash
VITE_FACTORY_CONTRACT_ADDRESS=0xYourDeployedFactoryAddress
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

`VITE_FACTORY_CONTRACT_ADDRESS` must be the address Remix gave you after
deploying `InventoryFactory` to Sepolia.

## 3. Replace the placeholder ABIs — important

`src/contracts/InventoryFactoryABI.json` and `src/contracts/ProductABI.json`
contain **illustrative ABIs** built strictly from the function signatures you
described (`listProduct`, `getProductContract`, `totalProducts`,
`getProductDetails`, `updateQuantity`, `updatePrice`, `transferOwnership`).

Your real contracts may:
- return values in a different order from `getProductDetails()`
- emit differently-named/shaped events on `listProduct()`
- use different parameter names

**Before running the app**, open Remix → your compiled contract → copy the
exact ABI JSON from the "Compilation Details" panel (or from
`artifacts/.../InventoryFactory.json` if you compiled with Hardhat/Foundry),
and paste it in place of the placeholder arrays in those two files. The rest
of the app (services, hooks, pages) already reads from these files, so
nothing else needs to change once the ABI matches your contract exactly.

If your `getProductDetails()` returns fields in a different order, adjust the
destructuring in `src/services/contractService.js` → `fetchProductDetails()`.

If `listProduct()` does **not** emit a `ProductListed` event, the app falls
back to reading `totalProducts()` right after the transaction confirms and
assumes the newest product is `totalProducts - 1` — this works as long as
product IDs are assigned sequentially.

## 4. Run the dev server

```bash
npm run dev
```

Open the printed local URL, install/unlock MetaMask, and connect. The app
will prompt you to switch networks automatically if you're not on Sepolia.

## Project structure

```
src/
├── components/     # Reusable UI: Sidebar, Layout, ProductCard, EditModal, etc.
├── pages/          # Dashboard, AddProduct, ProductList, ProductDetails, SmartContracts
├── services/       # walletService.js (MetaMask), contractService.js (contract calls)
├── contracts/      # InventoryFactoryABI.json, ProductABI.json  ← replace with real ABIs
├── hooks/          # useProducts.js
├── context/        # WalletContext.jsx, ThemeContext.jsx
├── utils/          # constants.js (env vars), formatters.js
├── App.jsx
└── main.jsx
```

## Notes

- No contract addresses are hardcoded in components — everything reads from
  `src/utils/constants.js`, which reads from `.env`.
- Read-only data (dashboard stats, product list) works even before a wallet
  is connected, via a public Sepolia RPC endpoint. Write actions
  (`listProduct`, `updateQuantity`, `updatePrice`, `transferOwnership`)
  require a connected wallet on Sepolia.
- `updateQuantity` / `updatePrice` / `transferOwnership` will revert on-chain
  if called by a non-owner wallet — the app surfaces the revert reason via a
  toast notification.
