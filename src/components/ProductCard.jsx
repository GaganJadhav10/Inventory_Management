import { Link } from 'react-router-dom'
import { ExternalLink, Eye, Package, PencilLine, Tag, Calendar, User } from 'lucide-react'
import GlassCard from './GlassCard.jsx'
import CopyButton from './CopyButton.jsx'
import { formatQuantity, formatTimestamp, formatCurrency, calculateTotalPrice, shortenAddress } from '../utils/formatters.js'
import { SEPOLIA_EXPLORER_BASE } from '../utils/constants.js'
import { getProductImage } from '../utils/productImages.js'

export default function ProductCard({ product, delay = 0, onEditQuantity, onEditPrice }) {
  const { id, name, category, quantity, price, owner, address, createdAt } = product

  return (
    <GlassCard delay={delay} hover className="flex flex-col gap-0 overflow-hidden p-0">
      {/* Product Image */}
      <img
        src={getProductImage(product.name)}
        alt={product.name}
        loading="lazy"
        className="w-full h-56 object-cover rounded-t-xl transition-transform duration-300 hover:scale-105"
      />

      <div className="flex flex-col gap-4 p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-cyan/15">
            <Package className="h-5 w-5 text-brand-500" strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-base font-bold text-slate-800 dark:text-white">{name}</p>
            <span className="badge-brand mt-1">
              <Tag className="h-3 w-3" /> {category}
            </span>
          </div>
        </div>
        <span className="rounded-lg bg-slate-900/5 px-2 py-1 font-mono text-[11px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-400">
          #{id}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-slate-900/5 dark:bg-white/5 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Unit Price</p>
          <p className="mt-1 font-display text-lg font-bold text-slate-800 dark:text-white">{formatCurrency(price)}</p>
        </div>
        <div className="rounded-xl bg-slate-900/5 dark:bg-white/5 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Quantity</p>
          <p className="mt-1 font-display text-lg font-bold text-slate-800 dark:text-white">{formatQuantity(quantity)}</p>
        </div>
        <div className="rounded-xl bg-slate-900/5 dark:bg-white/5 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Price</p>
          <p className="mt-1 font-display text-lg font-bold text-slate-800 dark:text-white">{formatCurrency(calculateTotalPrice(price, quantity))}</p>
        </div>
      </div>

      {/* Owner & Contract */}
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <p className="text-xs text-slate-400 dark:text-slate-500">Owner</p>
          <p className="font-mono text-xs text-slate-600 dark:text-slate-300">{shortenAddress(owner)}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded bg-brand-500/20 flex items-center justify-center">
              <span className="text-[8px] font-bold text-brand-500">ETH</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Contract</p>
            <p className="font-mono text-xs text-slate-600 dark:text-slate-300">{shortenAddress(address)}</p>
          </div>
          <div className="flex items-center gap-0.5">
            <CopyButton value={address} label="Copy contract address" />
            <a
              href={`${SEPOLIA_EXPLORER_BASE}/address/${address}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost !px-2 !py-1"
              title="View on Etherscan"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        {createdAt && (
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <p className="text-xs text-slate-400 dark:text-slate-500">{formatTimestamp(createdAt)}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200/60 dark:border-white/10">
        <Link to={`/products/${id}`} className="btn-primary flex-1 !py-2 !text-xs">
          <Eye className="h-3.5 w-3.5" /> View Details
        </Link>
        <button onClick={() => onEditQuantity?.(product)} className="btn-secondary flex-1 !py-2 !text-xs">
          <PencilLine className="h-3.5 w-3.5" /> Qty
        </button>
        <button onClick={() => onEditPrice?.(product)} className="btn-secondary flex-1 !py-2 !text-xs">
          <PencilLine className="h-3.5 w-3.5" /> Price
        </button>
      </div>
      </div>
    </GlassCard>
  )
}
