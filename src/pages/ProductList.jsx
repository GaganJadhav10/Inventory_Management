import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Boxes, PackagePlus, RefreshCw, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SkeletonCard } from '../components/Loader.jsx'
import ConfigWarning from '../components/ConfigWarning.jsx'
import EditModal from '../components/EditModal.jsx'
import { useProducts } from '../hooks/useProducts.js'
import { useWallet } from '../context/WalletContext.jsx'
import { updateProductPrice, updateProductQuantity } from '../services/contractService.js'
import { formatCurrency, calculateTotalPrice } from '../utils/formatters.js'

export default function ProductList() {
  const { products, isLoading, refresh } = useProducts()
  const { signer, isConnected, isCorrectNetwork } = useWallet()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
  }, [products, search])

  const requireWallet = () => {
    if (!isConnected) {
      toast.error('Connect your wallet first')
      return false
    }
    if (!isCorrectNetwork) {
      toast.error('Switch to Sepolia Testnet first')
      return false
    }
    return true
  }

  const handleEditQuantity = (product) => {
    if (!requireWallet()) return
    setModal({ type: 'quantity', product })
  }

  const handleEditPrice = (product) => {
    if (!requireWallet()) return
    setModal({ type: 'price', product })
  }

  const submitModal = async (values) => {
    if (!modal) return
    const toastId = toast.loading('Confirm the transaction in MetaMask...')
    try {
      if (modal.type === 'quantity') {
        await updateProductQuantity(modal.product.address, signer, values.newQuantity)
      } else {
        await updateProductPrice(modal.product.address, signer, values.newPrice)
      }
      toast.success('Updated on-chain successfully', { id: toastId })
      setModal(null)
      refresh()
    } catch (err) {
      console.error(err)
      const message = err?.shortMessage || err?.reason || err?.message || 'Transaction failed'
      toast.error(message, { id: toastId })
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <ConfigWarning />

      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white">All Products</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {products.length} product{products.length !== 1 ? 's' : ''} deployed on Sepolia
        </p>
      </div>

      {/* Search & Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input-field-with-icon"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 btn-ghost !p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={refresh} className="btn-secondary" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <Link to="/add-product" className="btn-primary">
            <PackagePlus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title={products.length === 0 ? 'No products listed yet' : 'No matches found'}
          description={
            products.length === 0
              ? 'Products you list through the factory contract will show up here.'
              : `No products match "${search}". Try a different search term.`
          }
          action={
            products.length === 0 && (
              <Link to="/add-product" className="btn-primary">
                <PackagePlus className="h-4 w-4" /> List your first product
              </Link>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProductCard
              key={p.address}
              product={p}
              delay={0.03 * i}
              onEditQuantity={handleEditQuantity}
              onEditPrice={handleEditPrice}
            />
          ))}
        </div>
      )}

      <EditModal
        isOpen={modal?.type === 'quantity'}
        onClose={() => setModal(null)}
        title="Update Quantity"
        description={modal?.product ? `${modal.product.name} · Unit Price: ${formatCurrency(modal.product.price)} · Current Total: ${formatCurrency(calculateTotalPrice(modal.product.price, modal.product.quantity))}` : ''}
        fields={[{ name: 'newQuantity', label: 'New Quantity', type: 'number', placeholder: 'e.g. 50', min: 0 }]}
        onSubmit={submitModal}
        submitLabel="Update Quantity"
      />

      <EditModal
        isOpen={modal?.type === 'price'}
        onClose={() => setModal(null)}
        title="Update Unit Price"
        description={modal?.product ? `${modal.product.name} · Current Unit Price: ${formatCurrency(modal.product.price)} · Qty: ${modal.product.quantity}` : ''}
        fields={[{ name: 'newPrice', label: 'New Unit Price (per item)', type: 'number', placeholder: 'e.g. 2500', min: 0 }]}
        onSubmit={submitModal}
        submitLabel="Update Unit Price"
      />
    </div>
  )
}
