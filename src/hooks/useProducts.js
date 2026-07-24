import { useCallback, useEffect, useState } from 'react'
import { fetchAllProducts } from '../services/contractService'
import { useWallet } from '../context/WalletContext'

/**
 * Loads every product from the factory + product contracts.
 * Falls back to the read-only RPC provider when no wallet is connected,
 * so the dashboard/list still work in a "browse only" state.
 */
export function useProducts({ auto = true } = {}) {
  const { provider } = useWallet()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchAllProducts(provider)
      setProducts(data)
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }, [provider])

  useEffect(() => {
    if (auto) refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, provider])

  return { products, isLoading, error, refresh }
}
