import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddProduct from './pages/AddProduct.jsx'
import ProductList from './pages/ProductList.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import SmartContracts from './pages/SmartContracts.jsx'
import { useTheme } from './context/ThemeContext.jsx'

export default function App() {
  const { theme } = useTheme()

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4500,
          style: {
            background: theme === 'dark' ? 'rgba(17, 22, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.08)',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/contracts" element={<SmartContracts />} />
        </Routes>
      </Layout>
    </>
  )
}
