import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  connectWallet as connectWalletService,
  getConnectedAccounts,
  getCurrentChainId,
  isMetaMaskInstalled,
  onAccountsChanged,
  onChainChanged,
  switchToSepolia,
} from '../services/walletService'
import { SEPOLIA_CHAIN_ID_HEX } from '../utils/constants'

const WalletContext = createContext(undefined)

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [address, setAddress] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const isCorrectNetwork = chainId?.toLowerCase() === SEPOLIA_CHAIN_ID_HEX.toLowerCase()
  const isConnected = Boolean(address)

  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install it to continue.')
      window.open('https://metamask.io/download/', '_blank')
      return
    }
    setIsConnecting(true)
    try {
      const { provider: p, signer: s, address: a } = await connectWalletService()
      setProvider(p)
      setSigner(s)
      setAddress(a)
      const cId = await getCurrentChainId()
      setChainId(cId)
      toast.success('Wallet connected')
    } catch (err) {
      console.error(err)
      toast.error(err?.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setProvider(null)
    setSigner(null)
    setAddress(null)
    toast('Wallet disconnected', { icon: '👋' })
  }, [])

  const switchNetwork = useCallback(async () => {
    try {
      await switchToSepolia()
      toast.success('Switched to Sepolia Testnet')
    } catch (err) {
      console.error(err)
      toast.error(err?.message || 'Failed to switch network')
    }
  }, [])

  // Silently re-hydrate an already-authorized connection on load.
  useEffect(() => {
    if (!isMetaMaskInstalled()) return
    ;(async () => {
      const accounts = await getConnectedAccounts()
      if (accounts && accounts.length > 0) {
        await connect()
      } else {
        const cId = await getCurrentChainId()
        setChainId(cId)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Live-sync with MetaMask account/network changes.
  useEffect(() => {
    const unsubAccounts = onAccountsChanged((accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnect()
      } else {
        setAddress(accounts[0])
      }
    })
    const unsubChain = onChainChanged((newChainId) => {
      setChainId(newChainId)
      // MetaMask recommends a full reload on chain change; a soft state
      // refresh works fine for this dApp so we avoid the jarring reload.
    })
    return () => {
      unsubAccounts()
      unsubChain()
    }
  }, [disconnect])

  const value = {
    provider,
    signer,
    address,
    chainId,
    isConnected,
    isCorrectNetwork,
    isConnecting,
    connect,
    disconnect,
    switchNetwork,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider')
  return ctx
}
