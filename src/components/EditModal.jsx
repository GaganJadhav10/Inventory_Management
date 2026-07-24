import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Spinner } from './Loader.jsx'

export default function EditModal({ isOpen, onClose, title, description, fields, onSubmit, submitLabel = 'Confirm' }) {
  const [values, setValues] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleChange = (name, value) => setValues((v) => ({ ...v, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(values)
      setValues({})
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-sm p-6 shadow-glass-xl"
        >
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
              {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
            </div>
            <button onClick={onClose} className="btn-icon !p-1.5" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="label-text" htmlFor={f.name}>
                  {f.label}
                </label>
                <input
                  id={f.name}
                  type={f.type || 'text'}
                  placeholder={f.placeholder}
                  required
                  min={f.type === 'number' ? 0 : undefined}
                  className="input-field"
                  value={values[f.name] || ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                />
              </div>
            ))}

            <button type="submit" disabled={isSubmitting} className="btn-primary mt-1 w-full">
              {isSubmitting ? <Spinner className="h-4 w-4 text-white" /> : null}
              {isSubmitting ? 'Confirming in MetaMask...' : submitLabel}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
