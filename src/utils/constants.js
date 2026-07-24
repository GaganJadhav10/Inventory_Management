// Central place for env-driven configuration.
// Nothing in this file is hardcoded per-component — components import from here.

export const FACTORY_CONTRACT_ADDRESS = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS

export const SEPOLIA_CHAIN_ID_DECIMAL = Number(import.meta.env.VITE_SEPOLIA_CHAIN_ID || 11155111)
export const SEPOLIA_CHAIN_ID_HEX = `0x${SEPOLIA_CHAIN_ID_DECIMAL.toString(16)}`

export const SEPOLIA_RPC_URL =
  import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'

export const SEPOLIA_NETWORK_PARAMS = {
  chainId: SEPOLIA_CHAIN_ID_HEX,
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [SEPOLIA_RPC_URL],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
}

export const SEPOLIA_EXPLORER_BASE = 'https://sepolia.etherscan.io'

export const isFactoryAddressConfigured = () =>
  Boolean(FACTORY_CONTRACT_ADDRESS) && FACTORY_CONTRACT_ADDRESS !== '0xYourDeployedFactoryAddressHere'
