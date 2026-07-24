import { useCallback, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, PencilLine, Send, Tag, Package, BarChart3, DollarSign, User, FileCode2, Calendar } from 'lucide-react'
import GlassCard from '../components/GlassCard.jsx'
import CopyButton from '../components/CopyButton.jsx'
import EditModal from '../components/EditModal.jsx'
import { LoadingState } from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useWallet } from '../context/WalletContext.jsx'
import { fetchProductById, transferProductOwnership, updateProductPrice, updateProductQuantity } from '../services/contractService.js'
import { formatPrice, formatQuantity, formatTimestamp, shortenAddress } from '../utils/formatters.js'
import { SEPOLIA_EXPLORER_BASE } from '../utils/constants.js'

export default function ProductDetails() {
  const { id } = useParams()
  const { provider, signer, isConnected, isCorrectNetwork } = useWallet()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalType, setModalType] = useState(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchProductById(id, provider)
      setProduct(data)
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Failed to load product')
    } finally {
      setIsLoading(false)
    }
  }, [id, provider])

  useEffect(() => {
    load()
  }, [load])

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

  const openModal = (type) => {
    if (!requireWallet()) return
    setModalType(type)
  }

  const submitModal = async (values) => {
    const toastId = toast.loading('Confirm the transaction in MetaMask...')
    try {
      if (modalType === 'quantity') {
        await updateProductQuantity(product.address, signer, values.newQuantity)
      } else if (modalType === 'price') {
        await updateProductPrice(product.address, signer, values.newPrice)
      } else if (modalType === 'owner') {
        await transferProductOwnership(product.address, signer, values.newOwner)
      }
      toast.success('Updated on-chain successfully', { id: toastId })
      setModalType(null)
      load()
    } catch (err) {
      console.error(err)
      const message = err?.shortMessage || err?.reason || err?.message || 'Transaction failed'
      toast.error(message, { id: toastId })
    }
  }

  if (isLoading) return <LoadingState label="Loading product from chain..." />

  if (error || !product) {
    return (
      <EmptyState
        icon={Tag}
        title="Product not found"
        description={error || `No product exists with id #${id}.`}
        action={
          <Link to="/products" className="btn-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/products" className="btn-ghost mb-4 -ml-2 text-slate-500 dark:text-slate-400">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        {/* Product Header Card */}
        <GlassCard className="mb-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-accent-cyan/15">
                <Package className="h-7 w-7 text-brand-500" strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-slate-900/5 px-2 py-1 font-mono text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                    #{product.id}
                  </span>
                  <span className="badge-brand">
                    <Tag className="h-3 w-3" /> {product.category}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold text-slate-800 dark:text-white">
                  {product.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailRow
              icon={BarChart3}
              label="Quantity"
              value={formatQuantity(product.quantity)}
              accent="from-brand-500 to-accent-cyan"
            />
            <DetailRow
              icon={DollarSign}
              label="Price"
              value={formatPrice(product.price)}
              accent="from-accent-emerald to-accent-cyan"
            />
            <DetailRow
              icon={User}
              label="Owner"
              value={shortenAddress(product.owner)}
              mono
              copyValue={product.owner}
              accent="from-accent-violet to-brand-500"
            />
            <DetailRow
              icon={FileCode2}
              label="Contract Address"
              value={shortenAddress(product.address)}
              mono
              copyValue={product.address}
              accent="from-brand-500 to-brand-600"
              extra={
                <a
                  href={`${SEPOLIA_EXPLORER_BASE}/address/${product.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost !px-2 !py-1"
                  title="View on Etherscan"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              }
            />
            <DetailRow
              icon={Calendar}
              label="Created"
              value={formatTimestamp(product.createdAt)}
              accent="from-accent-amber to-accent-rose"
              className="sm:col-span-2 lg:col-span-2"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200/60 dark:border-white/10 pt-6">
            <button onClick={() => openModal('quantity')} className="btn-secondary">
              <PencilLine className="h-4 w-4" /> Update Quantity
            </button>
            <button onClick={() => openModal('price')} className="btn-secondary">
              <PencilLine className="h-4 w-4" /> Update Price
            </button>
            <button onClick={() => openModal('owner')} className="btn-secondary">
              <Send className="h-4 w-4" /> Transfer Ownership
            </button>
          </div>
        </GlassCard>
      </motion.div>

      <EditModal
        isOpen={modalType === 'quantity'}
        onClose={() => setModalType(null)}
        title="Update Quantity"
        description={`Currently ${product.quantity.toString()}`}
        fields={[{ name: 'newQuantity', label: 'New Quantity', type: 'number', placeholder: 'e.g. 50' }]}
        onSubmit={submitModal}
        submitLabel="Update Quantity"
      />
      <EditModal
        isOpen={modalType === 'price'}
        onClose={() => setModalType(null)}
        title="Update Price"
        description={`Currently ${product.price.toString()}`}
        fields={[{ name: 'newPrice', label: 'New Price', type: 'number', placeholder: 'e.g. 30' }]}
        onSubmit={submitModal}
        submitLabel="Update Price"
      />
      <EditModal
        isOpen={modalType === 'owner'}
        onClose={() => setModalType(null)}
        title="Transfer Ownership"
        description="This permanently transfers control of this product contract to a new address."
        fields={[{ name: 'newOwner', label: 'New Owner Address', type: 'text', placeholder: '0x...' }]}
        onSubmit={submitModal}
        submitLabel="Transfer Ownership"
      />
    </div>
  )
}

function DetailRow({ icon: Icon, label, value, mono = false, copyValue, extra, accent = 'from-brand-500 to-accent-cyan', className = '' }) {
  return (
    <div className={`rounded-xl bg-slate-900/5 dark:bg-white/5 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${accent}`}>
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {label}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <p className={`text-sm text-slate-700 dark:text-slate-200 ${mono ? 'font-mono' : 'font-display font-semibold'}`}>
          {value}
        </p>
        {copyValue && <CopyButton value={copyValue} label={`Copy ${label}`} />}
        {extra}
      </div>
    </div>
  )
}
