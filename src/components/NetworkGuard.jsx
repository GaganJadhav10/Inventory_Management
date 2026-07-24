import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Plug } from 'lucide-react'
import { useWallet } from '../context/WalletContext.jsx'

export default function NetworkGuard() {
  const { isConnected, isCorrectNetwork, switchNetwork } = useWallet()

  const showBanner = isConnected && !isCorrectNetwork

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="flex flex-col items-center justify-between gap-3 border-b border-amber-400/30 bg-amber-400/10 px-4 py-3 sm:flex-row sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5 text-sm font-medium text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Wrong network detected. This app requires Ethereum Sepolia Testnet.
            </div>
            <button
              onClick={switchNetwork}
              className="whitespace-nowrap inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-amber-600 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plug className="h-3.5 w-3.5" /> Switch to Sepolia
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
