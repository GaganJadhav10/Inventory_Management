// Small, dependency-free formatting helpers shared across pages/components.

/** Shortens an address/hash to 0x1234…abcd form. */
export function shortenAddress(address, chars = 4) {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`
}

/** Formats a unix timestamp (seconds, as returned by Solidity) into a readable date. */
export function formatTimestamp(timestamp) {
  if (!timestamp) return '—'
  const ms = Number(timestamp) * 1000
  if (!Number.isFinite(ms) || ms <= 0) return '—'
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

/** Formats a raw on-chain integer price for display. Adjust divisor if your contract uses decimals. */
export function formatPrice(price) {
  if (price === undefined || price === null) return '—'
  try {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(price)
  } catch {
    return price.toString()
  }
}

/** Formats a quantity value. */
export function formatQuantity(qty) {
  if (qty === undefined || qty === null) return '—'
  return new Intl.NumberFormat().format(qty)
}

/** Builds a Sepolia Etherscan URL for an address or tx hash. */
export function etherscanUrl(base, valueOrHash, type = 'address') {
  return `${base}/${type}/${valueOrHash}`
}
