import { motion } from 'framer-motion'
import { Boxes, Wallet2, ArrowUpRight, PackagePlus, Network, Zap, Hexagon } from 'lucide-react'
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
        className="glass-card relative mb-8 overflow-hidden p-6 sm:p-8 lg:p-10"
      >
        {/* Background Effects */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gradient-to-br from-brand-500/20 to-accent-cyan/15 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gradient-to-tr from-accent-violet/15 to-brand-500/10 blur-3xl" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark opacity-50" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-4 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
                <Hexagon className="h-3.5 w-3.5" /> Blockchain Inventory Management
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="font-display text-3xl font-bold text-slate-800 dark:text-white sm:text-4xl"
            >
              On-chain inventory,{' '}
              <span className="gradient-text">verified on Sepolia</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-3 max-w-lg text-sm leading-relaxed text-slate-500 dark:text-slate-400"
            >
              Every product is deployed as an independent smart contract on Ethereum Sepolia.
              List new stock, track quantities, and transfer ownership — fully decentralized, no central database.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mt-5 flex flex-wrap gap-3"
            >
              {!isConnected ? (
                <button onClick={connect} className="btn-primary">
                  <Wallet2 className="h-4 w-4" /> Connect MetaMask
                </button>
              ) : (
                <>
                  <Link to="/add-product" className="btn-primary">
                    <PackagePlus className="h-4 w-4" /> Add Product
                  </Link>
                  <Link to="/products" className="btn-secondary">
                    <Boxes className="h-4 w-4" /> View Products
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden lg:flex shrink-0 items-center justify-center"
          >
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 animate-pulse-slow" />
              <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-brand-500/30 to-accent-violet/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-12 w-12 text-brand-500 dark:text-brand-400" />
              </div>
            </div>
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
