import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', delay = 0, hover = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`glass-card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
