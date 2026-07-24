import { ExternalLink, FileCode2, RefreshCw, Hexagon, Copy, User } from 'lucide-react'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard.jsx'
import CopyButton from '../components/CopyButton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SkeletonCard } from '../components/Loader.jsx'
import ConfigWarning from '../components/ConfigWarning.jsx'
import { useProducts } from '../hooks/useProducts.js'
import { shortenAddress } from '../utils/formatters.js'
import { FACTORY_CONTRACT_ADDRESS, SEPOLIA_EXPLORER_BASE, isFactoryAddressConfigured } from '../utils/constants.js'

export default function SmartContracts() {
  const { products, isLoading, refresh } = useProducts()

  return (
    <div className="mx-auto max-w-7xl">
      <ConfigWarning />

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Smart Contracts</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          All deployed contracts on Ethereum Sepolia Testnet
        </p>
      </div>

      {/* Factory Contract Summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="mb-8 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-glow">
                <Hexagon className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-display text-base font-bold text-slate-800 dark:text-white">InventoryFactory</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Core Factory Contract</p>
                <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-300">
                  {isFactoryAddressConfigured() ? FACTORY_CONTRACT_ADDRESS : 'Not configured'}
                </p>
              </div>
            </div>
            {isFactoryAddressConfigured() && (
              <div className="flex items-center gap-2">
                <CopyButton value={FACTORY_CONTRACT_ADDRESS} label="Copy factory address" />
                <a
                  href={`${SEPOLIA_EXPLORER_BASE}/address/${FACTORY_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary !py-2 text-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> View on Etherscan
                </a>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="section-title">Deployed Product Contracts</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {products.length} contract{products.length !== 1 ? 's' : ''} deployed
          </p>
        </div>
        <button onClick={refresh} className="btn-secondary" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Desktop Table */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={FileCode2}
          title="No contracts deployed yet"
          description="Product contracts deployed via the factory will appear here."
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl glass-card lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-white/[0.06] text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  <th className="px-5 py-4 font-bold">ID</th>
                  <th className="px-5 py-4 font-bold">Product Name</th>
                  <th className="px-5 py-4 font-bold">Owner</th>
                  <th className="px-5 py-4 font-bold">Contract Address</th>
                  <th className="px-5 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.address}
                    className="border-b border-slate-200/40 dark:border-white/[0.03] last:border-0 transition-colors hover:bg-slate-900/[0.02] dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-900/5 px-2 py-1 font-mono text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                        #{p.id}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-display font-semibold text-slate-700 dark:text-slate-200">
                      {p.name}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-accent-violet/20 to-brand-500/20">
                          <User className="h-3 w-3 text-brand-500" />
                        </div>
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                          {shortenAddress(p.owner)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {shortenAddress(p.address)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <CopyButton value={p.address} label="Copy contract address" />
                        <a
                          href={`${SEPOLIA_EXPLORER_BASE}/address/${p.address}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-ghost !px-2 !py-1"
                          title="Open in Sepolia Etherscan"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Card Fallback */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
            {products.map((p, i) => (
              <motion.div
                key={p.address}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * i }}
                className="glass-card p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-lg bg-slate-900/5 px-2 py-1 font-mono text-[11px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                    #{p.id}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <CopyButton value={p.address} label="Copy contract address" />
                    <a
                      href={`${SEPOLIA_EXPLORER_BASE}/address/${p.address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost !px-2 !py-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
                <p className="font-display font-bold text-slate-800 dark:text-white">{p.name}</p>
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Owner</p>
                    <p className="font-mono text-xs text-slate-600 dark:text-slate-300">{shortenAddress(p.owner)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Contract</p>
                    <p className="font-mono text-xs text-slate-600 dark:text-slate-300">{shortenAddress(p.address)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
