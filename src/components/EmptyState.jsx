import { motion } from 'framer-motion'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card flex flex-col items-center gap-4 px-6 py-16 text-center"
    >
      {Icon && (
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-brand-500/10 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-violet/20 border border-brand-500/10">
            <Icon className="h-8 w-8 text-brand-500" strokeWidth={1.5} />
          </div>
        </div>
      )}
      <div>
        <h3 className="font-display text-lg font-bold text-slate-700 dark:text-slate-200">{title}</h3>
        {description && (
          <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </motion.div>
  )
}
