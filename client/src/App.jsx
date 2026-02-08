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
import { Toaster } from 'react-hot-toast';
/**
 * Route protection logic:
 * - Redirects to login if not authenticated.
 * - Redirects admins away from user exchange pages to the admin panel.
 */
function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext)

  if (loading) return (
    <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCD535]"></div>
    </div>
  )
  
  if (!isAuthenticated) return <Navigate to="/login" />
  
  // If user is admin but tries to access user-only pages, send to admin dashboard
  if (!requireAdmin && isAdmin) return <Navigate to="/admin" />
  
  // If user is NOT admin but tries to access admin-only pages, send to user exchange
  if (requireAdmin && !isAdmin) return <Navigate to="/exchange" />

  return children
}

function AppContent() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white selection:bg-[#FCD535]/30">
      <Navbar />
       <Toaster position="top-right" />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER EXCHANGE FLOW (Admins redirected to /admin) */}
        <Route path="/exchange" element={
          <ProtectedRoute>
            <div className="max-w-4xl mx-auto p-4 md:p-10">
              <header className="mb-10">
                <h1 className="text-3xl font-black text-[#FCD535] uppercase italic">Fast Swap</h1>
                <p className="text-gray-500 text-sm font-bold">Direct platform-to-user settlement</p>
              </header>
              <Home /> 
            </div>
          </ProtectedRoute>
        } />

        {/* USER ACCOUNT ROUTES (Mirroring inr2usdt.com menu) */}
        <Route path="/trade/:tradeId" element={<ProtectedRoute><TradeStatus /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
        <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

        {/* ADMIN MANAGEMENT ROUTES */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
              <header className="mb-6 flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                <div>
                  <h1 className="text-2xl font-black text-[#FCD535] uppercase italic">Admin Command Center</h1>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Platform Liquidity & Verification</p>
                </div>
              </header>
              <AdminDashboard />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/master" element={
          <ProtectedRoute requireAdmin={true}>
            <MasterAdmin />
          </ProtectedRoute>
        } />

        {/* CATCH-ALL REDIRECT */}
        <Route path="*" element={<Navigate to="/" />} />
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