import laptopImg from '../assets/product-images/laptop.png'
import mobileImg from '../assets/product-images/mobile.png'
import smartwatchImg from '../assets/product-images/smartwatch.png'
import tvImg from '../assets/product-images/tv.png'
import defaultImg from '../assets/product-images/default.png'
import shoesImg from "../assets/product-images/Shoes.png";
const keywordMap = [
  { keywords: ['laptop', 'notebook', 'macbook', 'lenovo', 'thinkbook', 'thinkpad', 'dell', 'inspiron', 'xps', 'hp', 'pavilion', 'victus', 'acer', 'asus', 'rog', 'tuf', 'msi'], image: laptopImg },
  { keywords: ['mobile', 'phone', 'smartphone', 'iphone', 'samsung', 'galaxy', 'oneplus', 'xiaomi', 'redmi', 'realme', 'oppo', 'vivo', 'pixel', 'nothing'], image: mobileImg },
  { keywords: ['watch', 'smartwatch', 'apple watch', 'galaxy watch', 'smartwatch ultra'], image: smartwatchImg },
  { keywords: ['tv', 'television', 'smart tv', 'sony', 'bravia', 'lg', 'oled', 'qled', 'mi tv', 'android tv'], image: tvImg },
  {
    keywords: [
      'shoe',
      'shoes',
      'sneaker',
      'sneakers',
      'boot',
      'boots',
      'nike',
      'adidas',
      'puma',
      'reebok',
      'woodland',
      'bata',
      'crocs',
      'converse',
      'vans',
      'new balance',
      'asics',
      'fila',
      'loafer',
      'loafers',
      'running shoes',
      'sports shoes',
      'formal shoes',
      'casual shoes',
      'sandals',
      'slippers',
      'flip flops'
    ],
    image: shoesImg
  },
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
