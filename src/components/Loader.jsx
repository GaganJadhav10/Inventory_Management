import { Loader2 } from 'lucide-react'

export function Spinner({ className = 'h-5 w-5' }) {
  return <Loader2 className={`animate-spin text-brand-500 ${className}`} />
}

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 border border-brand-500/20">
          <Spinner className="h-6 w-6" />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="shimmer h-11 w-11 rounded-xl" />
        <div className="flex-1">
          <div className="shimmer mb-2 h-4 w-2/3 rounded-lg" />
          <div className="shimmer h-3 w-1/3 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="shimmer h-16 rounded-xl" />
        <div className="shimmer h-16 rounded-xl" />
      </div>
      <div className="shimmer mb-2 h-3 w-full rounded-lg" />
      <div className="shimmer h-3 w-1/2 rounded-lg" />
    </div>
  )
}
