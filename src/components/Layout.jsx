import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Bell, Search, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import ConnectWalletButton from './ConnectWalletButton.jsx'
import NetworkGuard from './NetworkGuard.jsx'
import { useWallet } from '../context/WalletContext.jsx'
import { shortenAddress } from '../utils/formatters.js'

const titles = {
  '/': 'Dashboard',
  '/add-product': 'Add Product',
  '/products': 'Products',
  '/contracts': 'Smart Contracts',
}

function pageTitle(pathname) {
  if (titles[pathname]) return titles[pathname]
  if (pathname.startsWith('/products/')) return 'Product Details'
  return ''
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const { isConnected, address, isCorrectNetwork } = useWallet()

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-30 border-b border-slate-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-[#0a0e1a]/70 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="btn-icon lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-display text-lg font-bold text-slate-800 dark:text-white">
                  {pageTitle(pathname)}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Network Badge */}
              {isConnected && (
                <div className={`hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  isCorrectNetwork
                    ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20'
                    : 'bg-accent-rose/10 text-accent-rose border border-accent-rose/20'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isCorrectNetwork ? 'bg-accent-emerald' : 'bg-accent-rose'} animate-pulse`} />
                  {isCorrectNetwork ? 'Sepolia' : 'Wrong Network'}
                </div>
              )}

              {/* Notification Bell */}
              <button className="btn-icon relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-rose" />
              </button>

              <ThemeToggle />
              <ConnectWalletButton />
            </div>
          </div>
          <NetworkGuard />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 sm:py-8">{children}</main>

        <footer className="px-4 py-5 text-center text-xs text-slate-400 dark:text-slate-600 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse" />
            <span>ChainInventory · Powered by Ethereum Sepolia Testnet</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
