import { Contract, JsonRpcProvider } from 'ethers'
import InventoryFactoryABI from '../contracts/InventoryFactoryABI.json'
import ProductABI from '../contracts/ProductABI.json'
import { FACTORY_CONTRACT_ADDRESS, SEPOLIA_RPC_URL } from '../utils/constants'

/**
 * contractService wraps every read/write call to the already-deployed
 * InventoryFactory and Product contracts. It never redefines contract logic —
 * it only encodes calls against the ABIs in src/contracts/.
 */

// Fallback read-only provider so the app can still show data before a wallet
// is connected (e.g. total products on the dashboard).
let readOnlyProvider = null
function getReadOnlyProvider() {
  if (!readOnlyProvider) {
    readOnlyProvider = new JsonRpcProvider(SEPOLIA_RPC_URL)
  }
  return readOnlyProvider
}

/** Returns an InventoryFactory contract instance. Pass a signer for write calls. */
export function getFactoryContract(signerOrProvider) {
  if (!FACTORY_CONTRACT_ADDRESS) {
    throw new Error('VITE_FACTORY_CONTRACT_ADDRESS is not set in your .env file.')
  }
  return new Contract(
    FACTORY_CONTRACT_ADDRESS,
    InventoryFactoryABI,
    signerOrProvider || getReadOnlyProvider()
  )
}

/** Returns a Product contract instance for a given deployed product address. */
export function getProductContract(productAddress, signerOrProvider) {
  return new Contract(productAddress, ProductABI, signerOrProvider || getReadOnlyProvider())
}

/** Reads the total number of products listed in the factory. */
export async function fetchTotalProducts(provider) {
  const factory = getFactoryContract(provider)
  const total = await factory.totalProducts()
  return Number(total)
}

/** Resolves the deployed Product contract address for a given product id. */
export async function fetchProductAddress(productId, provider) {
  const factory = getFactoryContract(provider)
  return factory.getProductContract(productId)
}

/** Reads full details for a single deployed Product contract. */
export async function fetchProductDetails(productAddress, provider) {
  const product = getProductContract(productAddress, provider)
  const details = await product.getProductDetails()
 return {
  id: Number(details[0]),
  address: productAddress,
  name: details[1],
  category: details[2],
  quantity: Number(details[3]),
  price: Number(details[4]),
  owner: details[5],
  createdAt: Number(details[6]),
}
}

/**
 * Fetches every listed product by walking productId 0..totalProducts-1,
 * resolving its contract address, then reading its details.
 * Returns an array in newest-first order for display convenience.
 */
export async function fetchAllProducts(provider) {
  const total = await fetchTotalProducts(provider)
  const productIds = Array.from(
  { length: total },
  (_, i) => i + 1
)
  const products = await Promise.all(
    productIds.map(async (id) => {
      try {
        const address = await fetchProductAddress(id, provider)
        const details = await fetchProductDetails(address, provider)
        return { id, ...details }
      } catch (err) {
        console.error(`Failed to load product ${id}:`, err)
        return null
      }
    })
  )

  return products.filter(Boolean).reverse()
}

/** Fetches a single product by id, including its resolved contract address. */
export async function fetchProductById(productId, provider) {
  const address = await fetchProductAddress(productId, provider)
  const details = await fetchProductDetails(address, provider)
  return details
}

/**
 * Calls InventoryFactory.listProduct(). Requires a signer (wallet must be connected).
 * Returns the transaction receipt so the caller can display the tx hash and
 * try to resolve the newly created product's contract address.
 */
export async function listProduct(signer, { name, category, quantity, price }) {
  const factory = getFactoryContract(signer)
  const tx = await factory.listProduct(name, category, quantity, price)
  const receipt = await tx.wait()
  return { tx, receipt }
}

/** Calls Product.updateQuantity(). Requires a signer that owns the product. */
export async function updateProductQuantity(productAddress, signer, newQuantity) {
  const product = getProductContract(productAddress, signer)
  const tx = await product.updateQuantity(newQuantity)
  return tx.wait()
}

/** Calls Product.updatePrice(). Requires a signer that owns the product. */
export async function updateProductPrice(productAddress, signer, newPrice) {
  const product = getProductContract(productAddress, signer)
  const tx = await product.updatePrice(newPrice)
  return tx.wait()
}

/** Calls Product.transferOwnership(). Requires a signer that owns the product. */
export async function transferProductOwnership(productAddress, signer, newOwner) {
  const product = getProductContract(productAddress, signer)
  const tx = await product.transferOwnership(newOwner)
  return tx.wait()
}

/**
 * Attempts to resolve the contract address of the product that was just
 * created by a listProduct() call, by reading the new totalProducts() count.
 * Falls back gracefully if the contract emits a ProductListed event instead —
 * check the receipt logs first when available.
 */
export async function resolveNewlyCreatedProductAddress(receipt, provider) {
  // Prefer decoding the ProductListed event if the contract emits one.
  try {
    const factory = getFactoryContract(provider)
    for (const log of receipt.logs) {
      try {
        const parsed = factory.interface.parseLog(log)
        if (parsed?.name === 'ProductListed') {
          return parsed.args.productContract
        }
      } catch {
        // Not a log from this contract/interface — skip.
      }
    }
  } catch (err) {
    console.warn('Could not parse ProductListed event, falling back to totalProducts().', err)
  }

  // Fallback: assume the new product is the last one (totalProducts - 1).
  const total = await fetchTotalProducts(provider)
  const newId = total - 1
  const address = await fetchProductAddress(newId, provider)
  return address
}
