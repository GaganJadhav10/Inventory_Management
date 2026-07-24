import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative flex h-9 w-9 items-center justify-center rounded-xl glass-panel transition-all duration-200 hover:bg-white/80 dark:hover:bg-white/10"
    >
      <motion.span
        initial={false}
        animate={{ rotate: isDark ? 360 : 0, scale: isDark ? 1 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-brand-300" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
      </motion.span>
    </button>
  )
}
