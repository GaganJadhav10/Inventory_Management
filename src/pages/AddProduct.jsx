import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { CheckCircle2, ExternalLink, PackagePlus, Wallet2, Hash, Tag, BarChart3, DollarSign, Loader2, FileCode2 } from 'lucide-react'
import GlassCard from '../components/GlassCard.jsx'
import CopyButton from '../components/CopyButton.jsx'
import { Spinner } from '../components/Loader.jsx'
import ConfigWarning from '../components/ConfigWarning.jsx'
import { useWallet } from '../context/WalletContext.jsx'
import { listProduct, resolveNewlyCreatedProductAddress } from '../services/contractService.js'
import { shortenAddress } from '../utils/formatters.js'
import { SEPOLIA_EXPLORER_BASE } from '../utils/constants.js'

const initialForm = { name: '', category: '', quantity: '', price: '' }

const formFields = [
  { name: 'name', label: 'Product Name', icon: Tag, placeholder: 'e.g. Wireless Mouse', type: 'text' },
  { name: 'category', label: 'Category', icon: Hash, placeholder: 'e.g. Electronics', type: 'text' },
  { name: 'quantity', label: 'Quantity', icon: BarChart3, placeholder: 'e.g. 100', type: 'number', min: 0 },
  { name: 'price', label: 'Price', icon: DollarSign, placeholder: 'e.g. 25', type: 'number', min: 0 },
]

const steps = [
  { label: 'Confirm in MetaMask', icon: Wallet2 },
  { label: 'Transaction Submitted', icon: CheckCircle2 },
  { label: 'Transaction Confirmed', icon: CheckCircle2 },
]

export default function AddProduct() {
  const { signer, provider, isConnected, isCorrectNetwork, connect } = useWallet()
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [step, setStep] = useState(-1)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isConnected) {
      toast.error('Connect your wallet first')
      return
    }
    if (!isCorrectNetwork) {
      toast.error('Switch to Sepolia Testnet first')
      return
    }
    if (!form.name.trim() || !form.category.trim() || form.quantity === '' || form.price === '') {
      toast.error('Fill in every field')
      return
    }

    setIsSubmitting(true)
    setResult(null)
    setStep(0)

    try {
      const { tx, receipt } = await listProduct(signer, {
        name: form.name.trim(),
        category: form.category.trim(),
        quantity: form.quantity,
        price: form.price,
      })

      setStep(1)

      let productAddress = null
      try {
        productAddress = await resolveNewlyCreatedProductAddress(receipt, provider)
      } catch (err) {
        console.warn('Could not resolve new product address automatically.', err)
      }

      setStep(2)
      setResult({ txHash: tx.hash, productAddress })
      setForm(initialForm)
      toast.success('Product listed on-chain!')
    } catch (err) {
      console.error(err)
      const message = err?.shortMessage || err?.reason || err?.message || 'Transaction failed'
      toast.error(message)
      setStep(-1)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ConfigWarning />

      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white">List a New Product</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Deploy a brand-new Product smart contract owned by your wallet through the InventoryFactory.
        </p>
      </motion.div>

      {/* Form Card */}
      <GlassCard delay={0.05} className="p-6 sm:p-8">
        {!isConnected ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-violet/20">
              <Wallet2 className="h-8 w-8 text-brand-500" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-slate-800 dark:text-white">Connect Your Wallet</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">You need a wallet to deploy smart contracts</p>
            </div>
            <button onClick={connect} className="btn-primary">
              <Wallet2 className="h-4 w-4" /> Connect MetaMask
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {formFields.map(({ name, label, icon: Icon, placeholder, type, min }) => (
                <div key={name} className="relative">
                  <label className="label-text" htmlFor={name}>{label}</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                      <Icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id={name}
                      name={name}
                      type={type}
                      min={min}
                      className="input-field-with-icon"
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Step Indicator */}
            <AnimatePresence>
              {isSubmitting && step >= 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl bg-brand-500/5 border border-brand-500/10 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 text-brand-500 animate-spin" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {step === 0 && 'Waiting for MetaMask confirmation...'}
                      {step === 1 && 'Transaction submitted — waiting for confirmation...'}
                      {step === 2 && 'Transaction confirmed!'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={isSubmitting || !isCorrectNetwork} className="btn-primary mt-2 self-start">
              {isSubmitting ? <Spinner className="h-4 w-4 text-white" /> : <PackagePlus className="h-4 w-4" />}
              {isSubmitting ? 'Processing...' : 'Create Product'}
            </button>
            {!isCorrectNetwork && (
              <p className="text-xs font-medium text-accent-rose">Switch to Sepolia Testnet to enable this form.</p>
            )}
          </form>
        )}
      </GlassCard>

      {/* Success Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            className="mt-6 rounded-2xl border border-accent-emerald/30 bg-accent-emerald/5 p-6 backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-emerald/20">
                <CheckCircle2 className="h-5 w-5 text-accent-emerald" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white">
                  Product Created Successfully
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your product is now on-chain</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Transaction Hash</p>
                  <p className="mt-0.5 font-mono text-xs text-slate-700 dark:text-slate-200 truncate">{shortenAddress(result.txHash, 8)}</p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <CopyButton value={result.txHash} label="Copy transaction hash" />
                  <a
                    href={`${SEPOLIA_EXPLORER_BASE}/tx/${result.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost !px-2 !py-1"
                    title="View on Etherscan"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {result.productAddress && (
                <div className="flex items-center justify-between gap-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">New Product Contract</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-700 dark:text-slate-200 truncate">
                      {shortenAddress(result.productAddress, 8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <CopyButton value={result.productAddress} label="Copy contract address" />
                    <a
                      href={`${SEPOLIA_EXPLORER_BASE}/address/${result.productAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost !px-2 !py-1"
                      title="View on Etherscan"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
