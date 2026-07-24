import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  PackagePlus,
  Boxes,
  FileCode2,
  Wallet,
  Settings,
  X,
  Hexagon,
} from 'lucide-react'
import { useWallet } from '../context/WalletContext.jsx'
import { shortenAddress } from '../utils/formatters.js'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Boxes },
  { to: '/add-product', label: 'Add Product', icon: PackagePlus },
  { to: '/contracts', label: 'Smart Contracts', icon: FileCode2 },
]

const bottomItems = [
  { to: '#wallet', label: 'Wallet', icon: Wallet, isAction: true },
  { to: '#settings', label: 'Settings', icon: Settings, isAction: true },
]

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

export default function Sidebar({ isOpen, onClose }) {
  const { isConnected, address, isCorrectNetwork } = useWallet()
  const isDesktop = useIsDesktop()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: isDesktop ? 0 : (isOpen ? 0 : '-100%') }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/60 dark:border-white/[0.06]
          bg-white/80 dark:bg-[#0c1120]/90 backdrop-blur-2xl lg:static lg:translate-x-0 lg:flex"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-glow">
              <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
              <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#0c1120] bg-accent-emerald" />
            </div>
            <div>
              <p className="font-display text-base font-bold text-slate-800 dark:text-white">
                ChainInventory
              </p>
              <p className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse" />
                Sepolia Testnet
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon !p-1.5 lg:hidden" aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

        {/* Navigation */}
        <nav className="mt-6 flex flex-1 flex-col gap-1 px-3">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Navigation
          </p>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-glow'
                    : 'text-slate-600 hover:bg-slate-900/5 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className="relative z-10 h-[18px] w-[18px]" strokeWidth={2} />
                  <span className="relative z-10">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-4">
          {/* Divider */}
          <div className="mb-3 mx-1 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

          {bottomItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 transition-all duration-200 hover:bg-slate-900/5 dark:hover:bg-white/5 dark:hover:text-slate-200"
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              <span>{label}</span>
            </button>
          ))}

          {/* Wallet Card */}
          <div className="mt-3 rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-cyan/10 border border-brand-500/20 px-4 py-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </p>
                {isConnected ? (
                  <p className="mt-1 font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                    {shortenAddress(address)}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Not connected
                  </p>
                )}
              </div>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isConnected && isCorrectNetwork ? 'bg-accent-emerald/20' : 'bg-slate-200 dark:bg-white/10'}`}>
                <Wallet className={`h-4 w-4 ${isConnected && isCorrectNetwork ? 'text-accent-emerald' : 'text-slate-400'}`} />
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
