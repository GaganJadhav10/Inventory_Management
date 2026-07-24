import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import GlassCard from './GlassCard.jsx'

function AnimatedCounter({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const numericValue = typeof value === 'number' ? value : null

  useEffect(() => {
    if (numericValue === null || numericValue === undefined) {
      setDisplay(value)
      return
    }

    let start = 0
    const end = numericValue
    if (start === end) return

    const incrementTime = Math.max(Math.floor(duration / end), 16)
    const step = Math.max(1, Math.floor(end / (duration / incrementTime)))

    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setDisplay(end)
        clearInterval(timer)
      } else {
        setDisplay(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [numericValue, duration])

  return <>{numericValue !== null ? display : value}</>
}

export default function StatCard({ icon: Icon, label, value, accent = 'from-brand-500 to-accent-cyan', delay = 0, sub }) {
  return (
    <GlassCard delay={delay} hover className="p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-slate-800 dark:text-white">
            {typeof value === 'number' ? (
              <AnimatedCounter value={value} />
            ) : (
              value
            )}
          </p>
          {sub && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 truncate">{sub}</p>}
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} shadow-glow`}>
          <Icon className="h-5 w-5 text-white" strokeWidth={2} />
        </div>
      </div>
    </GlassCard>
  )
}
