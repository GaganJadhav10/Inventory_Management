import { Wallet, LogOut, Loader2, Copy, ExternalLink, Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '../context/WalletContext.jsx'
import { shortenAddress } from '../utils/formatters.js'

export default function ConnectWalletButton() {
  const { isConnected, address, isConnecting, connect, disconnect } = useWallet()
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* noop */ }
  }

  if (!isConnected) {
    return (
      <button onClick={connect} disabled={isConnecting} className="btn-primary">
        {isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        {isConnecting ? 'Connecting…' : 'Connect'}
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-xl glass-panel py-2 pl-2 pr-3 transition-all duration-200 hover:bg-white/80 dark:hover:bg-white/10"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-600">
          <span className="font-display text-[10px] font-bold text-white">
            {address?.slice(2, 4).toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:block font-mono text-sm font-medium text-slate-700 dark:text-slate-200">
          {shortenAddress(address)}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute right-0 z-20 mt-2 w-64 rounded-2xl glass-card p-2 shadow-glass-lg"
            >
              <div className="rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-cyan/10 border border-brand-500/10 p-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-glow">
                    <span className="font-display text-sm font-bold text-white">
                      {address?.slice(2, 4).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Connected Wallet</p>
                    <p className="font-mono text-sm font-medium text-slate-700 dark:text-slate-200">
                      {shortenAddress(address, 6)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="btn-ghost w-full justify-start gap-3 rounded-xl px-3 py-2.5"
              >
                {copied ? <Check className="h-4 w-4 text-accent-emerald" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Address'}
              </button>
              <a
                href={`https://sepolia.etherscan.io/address/${address}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost w-full justify-start gap-3 rounded-xl px-3 py-2.5"
                onClick={() => setMenuOpen(false)}
              >
                <ExternalLink className="h-4 w-4" />
                View on Etherscan
              </a>
              <div className="my-1 h-px bg-slate-200/60 dark:bg-white/10" />
              <button
                onClick={() => {
                  disconnect()
                  setMenuOpen(false)
                }}
                className="btn-ghost w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-accent-rose hover:bg-accent-rose/10 dark:hover:bg-accent-rose/10"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
