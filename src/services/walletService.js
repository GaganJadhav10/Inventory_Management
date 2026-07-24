import { BrowserProvider } from 'ethers'
import { SEPOLIA_CHAIN_ID_HEX, SEPOLIA_NETWORK_PARAMS } from '../utils/constants'

/**
 * walletService centralizes every direct interaction with `window.ethereum`
 * (MetaMask). Nothing else in the app should touch `window.ethereum` directly.
 */

export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && Boolean(window.ethereum)
}

/** Requests account access and returns an ethers v6 BrowserProvider. */
export async function connectWallet() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install it to continue.')
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts were authorized in MetaMask.')
  }

  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  return { provider, signer, address: accounts[0] }
}

/** Returns the currently connected accounts without prompting the user. */
export async function getConnectedAccounts() {
  if (!isMetaMaskInstalled()) return []
  return window.ethereum.request({ method: 'eth_accounts' })
}

/** Returns the current chain id as a hex string (e.g. "0xaa36a7"). */
export async function getCurrentChainId() {
  if (!isMetaMaskInstalled()) return null
  return window.ethereum.request({ method: 'eth_chainId' })
}

/** True if MetaMask is currently pointed at Sepolia. */
export async function isOnSepolia() {
  const chainId = await getCurrentChainId()
  return chainId?.toLowerCase() === SEPOLIA_CHAIN_ID_HEX.toLowerCase()
}

/**
 * Prompts MetaMask to switch to Sepolia. If the network hasn't been added to
 * the user's wallet yet (error code 4902), falls back to adding it first.
 */
export async function switchToSepolia() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed.')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    })
  } catch (switchError) {
    // 4902 = the chain has not been added to MetaMask yet.
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [SEPOLIA_NETWORK_PARAMS],
      })
    } else {
      throw switchError
    }
  }
}

/** Subscribes to MetaMask account changes. Returns an unsubscribe function. */
export function onAccountsChanged(callback) {
  if (!isMetaMaskInstalled()) return () => {}
  window.ethereum.on('accountsChanged', callback)
  return () => window.ethereum.removeListener('accountsChanged', callback)
}

/** Subscribes to MetaMask network/chain changes. Returns an unsubscribe function. */
export function onChainChanged(callback) {
  if (!isMetaMaskInstalled()) return () => {}
  window.ethereum.on('chainChanged', callback)
  return () => window.ethereum.removeListener('chainChanged', callback)
}
