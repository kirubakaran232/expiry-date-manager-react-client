import { useState, useEffect } from 'react'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AddProductPage from './pages/AddProductPage'
import EditProductPage from './pages/EditProductPage'

// ── Minimal pathname router ───────────────────────────────────────────────────
const usePathname = () => {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const handler = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])
  return path
}

function Router() {
  const path = usePathname()

  if (path === '/login') return <LoginPage />
  if (path === '/register') return <RegisterPage />

  if (path === '/dashboard') {
    return (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  }

  if (path === '/products/add') {
    return (
      <ProtectedRoute>
        <AddProductPage />
      </ProtectedRoute>
    )
  }

  // Match /products/:id/edit
  if (/^\/products\/[^/]+\/edit$/.test(path)) {
    return (
      <ProtectedRoute>
        <EditProductPage />
      </ProtectedRoute>
    )
  }

  return <LandingPage />
}

function App() {
  return (
    <AuthProvider>
      <div className="font-[Inter,system-ui,sans-serif] antialiased">
        <Router />
      </div>
    </AuthProvider>
  )
}

export default App
