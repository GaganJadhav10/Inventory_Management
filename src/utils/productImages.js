import laptopImg from '../assets/products/laptop.svg'
import phoneImg from '../assets/products/phone.svg'
import watchImg from '../assets/products/watch.svg'
import shoesImg from '../assets/products/shoes.svg'
import televisionImg from '../assets/products/television.svg'
import keyboardImg from '../assets/products/keyboard.svg'
import mouseImg from '../assets/products/mouse.svg'
import cameraImg from '../assets/products/camera.svg'
import headphonesImg from '../assets/products/headphones.svg'
import defaultImg from '../assets/products/default.svg'

const keywordMap = [
  { keywords: ['laptop', 'notebook'], image: laptopImg },
  { keywords: ['phone', 'iphone', 'samsung galaxy', 'smartphone', 'mobile'], image: phoneImg },
  { keywords: ['watch', 'smartwatch', 'smart watch'], image: watchImg },
  { keywords: ['shoe', 'shoes', 'sneaker', 'sneakers', 'boot', 'boots'], image: shoesImg },
  { keywords: ['television', 'tv', 'monitor', 'display'], image: televisionImg },
  { keywords: ['keyboard', 'mechanical keyboard'], image: keyboardImg },
  { keywords: ['mouse', 'trackpad'], image: mouseImg },
  { keywords: ['camera', 'dslr', 'mirrorless', 'webcam'], image: cameraImg },
  { keywords: ['headphone', 'headphones', 'earphone', 'earphones', 'earbuds', 'headset'], image: headphonesImg },
]

export function getProductImage(productName) {
  if (!productName) return defaultImg
  const lower = productName.toLowerCase()
  for (const { keywords, image } of keywordMap) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return image
    }
  }
  return defaultImg
}
