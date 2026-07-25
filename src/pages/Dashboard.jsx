import { motion } from 'framer-motion'
import { Boxes, Wallet2, ArrowUpRight, PackagePlus, Network, Hexagon } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard.jsx'
import ConfigWarning from '../components/ConfigWarning.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SkeletonCard } from '../components/Loader.jsx'
import { useWallet } from '../context/WalletContext.jsx'
import { useProducts } from '../hooks/useProducts.js'
import { shortenAddress } from '../utils/formatters.js'
import { SEPOLIA_CHAIN_ID_DECIMAL } from '../utils/constants.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Dashboard() {
  const { isConnected, address, chainId, isCorrectNetwork, connect } = useWallet()
  const { products, isLoading } = useProducts()

  const recentProducts = products.slice(0, 4)

  return (
    <div className="w-full">
      <ConfigWarning />

      {/* Premium Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-card relative mb-8 overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-10"
      >
        {/* Background Effects */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gradient-to-br from-brand-500/20 to-accent-cyan/15 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gradient-to-tr from-accent-violet/15 to-brand-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-accent-cyan/10 blur-3xl" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark opacity-50" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-600 backdrop-blur-sm dark:text-brand-300">
                <Hexagon className="h-3.5 w-3.5" /> Inventory Dashboard
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="font-display text-4xl font-bold leading-tight text-slate-800 dark:text-white sm:text-4xl lg:text-5xl"
            >
              Blockchain{' '}
              <span className="gradient-text">Inventory</span>
              <br className="hidden sm:block" /> Management
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              {!isConnected ? (
                <button onClick={connect} className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-display font-semibold text-sm text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-glow-lg active:translate-y-0">
                  <Wallet2 className="h-5 w-5" /> Connect MetaMask
                </button>
              ) : (
                <>
                  <Link to="/add-product" className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-display font-semibold text-sm text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-glow-lg active:translate-y-0">
                    <PackagePlus className="h-5 w-5" /> Add Product
                  </Link>
                  <Link to="/products" className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/40 bg-white/60 px-6 py-3 font-display font-semibold text-sm text-slate-700 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/80 active:translate-y-0 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/10">
                    <Boxes className="h-5 w-5" /> View Products
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Illustration — Blockchain Network */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden lg:flex shrink-0 items-center justify-center"
          >
            <svg
              viewBox="0 0 240 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-52 w-52 xl:h-60 xl:w-60"
            >
              {/* Glow filter */}
              <defs>
                <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {/* Connecting lines */}
              <line x1="120" y1="55" x2="55" y2="130" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
                <animate attributeName="strokeDashoffset" values="8;0" dur="2s" repeatCount="indefinite" />
              </line>
              <line x1="120" y1="55" x2="185" y2="130" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
                <animate attributeName="strokeDashoffset" values="8;0" dur="2s" repeatCount="indefinite" />
              </line>
              <line x1="55" y1="130" x2="120" y2="200" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
                <animate attributeName="strokeDashoffset" values="8;0" dur="2s" repeatCount="indefinite" />
              </line>
              <line x1="185" y1="130" x2="120" y2="200" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
                <animate attributeName="strokeDashoffset" values="8;0" dur="2s" repeatCount="indefinite" />
              </line>

              {/* Top hexagon node */}
              <g filter="url(#heroGlow)">
                <polygon points="120,30 140,42 140,66 120,78 100,66 100,42" fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="1.5" />
                <polygon points="120,38 134,47 134,63 120,72 106,63 106,47" fill="rgba(99,102,241,0.08)" stroke="#6366f1" strokeWidth="0.5" opacity="0.5" />
                {/* Box icon inside */}
                <rect x="112" y="46" width="16" height="14" rx="2" fill="none" stroke="#818cf8" strokeWidth="1.5" />
                <line x1="112" y1="51" x2="128" y2="51" stroke="#818cf8" strokeWidth="1" />
                <line x1="120" y1="46" x2="120" y2="51" stroke="#818cf8" strokeWidth="1" />
              </g>

              {/* Left hexagon node */}
              <g filter="url(#heroGlow)">
                <polygon points="55,105 75,117 75,141 55,153 35,141 35,117" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.5" />
                <polygon points="55,113 69,122 69,138 55,147 41,138 41,122" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="0.5" opacity="0.5" />
                {/* Chain link icon */}
                <rect x="47" y="121" width="10" height="10" rx="3" fill="none" stroke="#22d3ee" strokeWidth="1.3" />
                <rect x="53" y="125" width="10" height="10" rx="3" fill="none" stroke="#22d3ee" strokeWidth="1.3" />
              </g>

              {/* Right hexagon node */}
              <g filter="url(#heroGlow)">
                <polygon points="185,105 205,117 205,141 185,153 165,141 165,117" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1.5" />
                <polygon points="185,113 199,122 199,138 185,147 171,138 171,122" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" strokeWidth="0.5" opacity="0.5" />
                {/* Document/contract icon */}
                <rect x="179" y="120" width="12" height="16" rx="2" fill="none" stroke="#c4b5fd" strokeWidth="1.3" />
                <line x1="182" y1="125" x2="188" y2="125" stroke="#c4b5fd" strokeWidth="1" />
                <line x1="182" y1="129" x2="188" y2="129" stroke="#c4b5fd" strokeWidth="1" />
                <line x1="182" y1="133" x2="186" y2="133" stroke="#c4b5fd" strokeWidth="1" />
              </g>

              {/* Bottom hexagon node */}
              <g filter="url(#heroGlow)">
                <polygon points="120,175 140,187 140,211 120,223 100,211 100,187" fill="rgba(99,102,241,0.12)" stroke="#6366f1" strokeWidth="1.5" />
                <polygon points="120,183 134,192 134,208 120,217 106,208 106,192" fill="rgba(99,102,241,0.06)" stroke="#6366f1" strokeWidth="0.5" opacity="0.5" />
                {/* Network/globe icon */}
                <circle cx="120" cy="199" r="7" fill="none" stroke="#818cf8" strokeWidth="1.3" />
                <ellipse cx="120" cy="199" rx="4" ry="7" fill="none" stroke="#818cf8" strokeWidth="0.8" opacity="0.6" />
                <line x1="113" y1="199" x2="127" y2="199" stroke="#818cf8" strokeWidth="0.8" opacity="0.6" />
              </g>

              {/* Orbiting dot */}
              <circle r="3" fill="#6366f1" opacity="0.7">
                <animateMotion dur="6s" repeatCount="indefinite" path="M120,55 L185,130 L120,200 L55,130 Z" />
              </circle>
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Wallet2}
          label="Wallet Status"
          value={isConnected ? 'Connected' : 'Not Connected'}
          accent={isConnected ? 'from-accent-emerald to-brand-500' : 'from-slate-400 to-slate-500'}
          delay={0.05}
          sub={isConnected ? shortenAddress(address) : 'Click to connect'}
        />
        <StatCard
          icon={Network}
          label="Connected Network"
          value={
            isConnected
              ? isCorrectNetwork
                ? 'Sepolia'
                : `Chain ${chainId ? parseInt(chainId, 16) : '?'}`
              : 'Not Connected'
          }
          accent={isCorrectNetwork && isConnected ? 'from-accent-emerald to-accent-cyan' : 'from-accent-rose to-accent-amber'}
          delay={0.1}
          sub={isConnected ? (isCorrectNetwork ? 'Testnet Active' : 'Wrong Network') : `Expected: Sepolia (${SEPOLIA_CHAIN_ID_DECIMAL})`}
        />
        <StatCard
          icon={Boxes}
          label="Total Products"
          value={isLoading ? '…' : products.length}
          accent="from-brand-500 to-accent-cyan"
          delay={0.15}
          sub="On-chain contracts"
        />
        <StatCard
          icon={Hexagon}
          label="Smart Contracts"
          value={isLoading ? '…' : products.length + 1}
          accent="from-accent-violet to-brand-600"
          delay={0.2}
          sub={`${products.length} products + 1 factory`}
        />
      </div>

      {/* Recent Products */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="section-title">Recent Products</h3>
          <Link to="/products" className="btn-ghost text-brand-600 dark:text-brand-300">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recentProducts.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title="No products listed yet"
            description="Products you list through the factory contract will show up here."
            action={
              <Link to="/add-product" className="btn-primary">
                <PackagePlus className="h-4 w-4" /> List your first product
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {recentProducts.map((p, i) => (
              <ProductCard key={p.address} product={p} delay={0.05 * i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
