import { motion } from 'framer-motion'
import { Hexagon, ArrowDown, FileCode2 } from 'lucide-react'
import { shortenAddress } from '../utils/formatters.js'
import { SEPOLIA_EXPLORER_BASE } from '../utils/constants.js'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const nodeVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
}

export default function BlockchainVisualization({ products, factoryAddress }) {
  const displayProducts = products.slice(0, 4)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-card p-6 sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20">
          <Hexagon className="h-5 w-5 text-brand-500" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-slate-800 dark:text-white">
            Smart Contract Architecture
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Each product is a unique deployed contract
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-0">
        {/* Factory Node */}
        <motion.div
          variants={nodeVariants}
          className="relative rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 px-6 py-4 shadow-glow text-center w-full max-w-xs"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Factory Contract</p>
          <p className="mt-1 font-display text-sm font-bold text-white">InventoryFactory</p>
          {factoryAddress && (
            <p className="mt-1 font-mono text-[10px] text-white/70">
              {shortenAddress(factoryAddress, 6)}
            </p>
          )}
        </motion.div>

        {/* Connecting Lines */}
        <div className="flex flex-col items-center">
          {[...Array(Math.min(displayProducts.length, 3))].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-6 w-px bg-gradient-to-b from-brand-400 to-brand-400/30 dark:from-brand-500 dark:to-brand-500/30" />
              <div className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Product Contracts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.address}
              variants={nodeVariants}
              className="flex items-center gap-3 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] px-4 py-3 hover:bg-white/80 dark:hover:bg-white/[0.06] transition-colors cursor-default"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan/20 to-brand-500/20">
                <FileCode2 className="h-4 w-4 text-brand-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                  Product #{product.id}
                </p>
                <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {shortenAddress(product.address, 6)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length > 4 && (
          <motion.p
            variants={nodeVariants}
            className="mt-3 text-xs text-slate-400 dark:text-slate-500"
          >
            +{products.length - 4} more contracts deployed
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
