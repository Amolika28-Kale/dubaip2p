import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext, AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './components/Home'
import AdminDashboard from './components/AdminDashboard'
import MasterAdmin from './pages/MasterAdmin'
import Checkout from './pages/Checkout'
import TradeStatus from './pages/TradeStatus'
import Dashboard from './pages/Dashboard'
import PaymentHistory from './pages/PaymentHistory'
import Referral from './pages/Referral'
import Reviews from './pages/Reviews'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext)

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><p>Loading...</p></div>
  if (!isAuthenticated) return <Navigate to="/login" />
  if (requireAdmin && !isAdmin) return <Navigate to="/exchange" />

  return children
}

function AppContent() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/trade/:tradeId" element={<ProtectedRoute><TradeStatus /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
        <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route
          path="/exchange"
          element={
            <ProtectedRoute>
              <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-[#FCD535] mb-8">DubaiP2P Exchange</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Home />
                  <AdminDashboard />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-[#FCD535] mb-8">Admin Panel</h1>
                <AdminDashboard />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/master" element={<ProtectedRoute requireAdmin={true}><MasterAdmin /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}
