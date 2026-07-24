import { AlertOctagon } from 'lucide-react'
import { isFactoryAddressConfigured } from '../utils/constants.js'

/** Renders nothing once VITE_FACTORY_CONTRACT_ADDRESS has been set correctly. */
export default function ConfigWarning() {
  if (isFactoryAddressConfigured()) return null

  return (
    <div className="glass-card mb-6 flex items-start gap-3 border-accent-rose/30 p-4">
      <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-accent-rose" />
      <div className="text-sm">
        <p className="font-semibold text-slate-700 dark:text-slate-200">Factory contract address not configured</p>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Set <code className="rounded bg-slate-900/10 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">VITE_FACTORY_CONTRACT_ADDRESS</code>{' '}
          in your <code className="rounded bg-slate-900/10 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">.env</code> file to your deployed
          InventoryFactory address, then restart the dev server.
        </p>
      </div>
    </div>
  )
}
