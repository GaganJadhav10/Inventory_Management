const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY
const PEXELS_API_URL = 'https://api.pexels.com/v1/search'

const imageCache = new Map()

function normalizeQuery(productName) {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function fetchProductImage(productName) {
  if (!productName) return null
  if (!PEXELS_API_KEY) return null

  const query = normalizeQuery(productName)
  if (!query) return null

  if (imageCache.has(query)) {
    return imageCache.get(query)
  }

  try {
    const params = new URLSearchParams({
      query,
      per_page: '1',
      orientation: 'landscape',
    })

    const response = await fetch(`${PEXELS_API_URL}?${params}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    })

    if (!response.ok) {
      imageCache.set(query, null)
      return null
    }

    const data = await response.json()

    if (data.photos && data.photos.length > 0) {
      const imageUrl = data.photos[0].src.medium
      imageCache.set(query, imageUrl)
      return imageUrl
    }

    imageCache.set(query, null)
    return null
  } catch {
    imageCache.set(query, null)
    return null
  }
}

export function getCachedImage(productName) {
  if (!productName) return null
  const query = normalizeQuery(productName)
  if (imageCache.has(query)) {
    return imageCache.get(query)
  }
  return undefined
}
