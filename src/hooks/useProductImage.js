import { useEffect, useState } from 'react'
import { fetchProductImage, getCachedImage } from '../services/imageService.js'
import { getProductImage } from '../utils/productImages.js'

export function useProductImage(productName) {
  const localFallback = getProductImage(productName)
  const [imageUrl, setImageUrl] = useState(() => {
    const cached = getCachedImage(productName)
    if (cached !== undefined) return cached || localFallback
    return localFallback
  })
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    if (!productName) return

    const cached = getCachedImage(productName)
    if (cached !== undefined) {
      setImageUrl(cached || localFallback)
      return
    }

    let cancelled = false
    setIsFetching(true)

    fetchProductImage(productName).then((remoteUrl) => {
      if (cancelled) return
      setImageUrl(remoteUrl || localFallback)
      setIsFetching(false)
    })

    return () => {
      cancelled = true
    }
  }, [productName, localFallback])

  return { imageUrl, isFetching }
}
