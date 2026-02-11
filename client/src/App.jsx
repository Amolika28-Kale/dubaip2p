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
import ForgotPassword from './pages/ForgotPassword'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext)

  if (loading) return (
    <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-[#FCD535]"></div>
    </div>
  )
  
  if (!isAuthenticated) return <Navigate to="/login" />
  if (!requireAdmin && isAdmin) return <Navigate to="/admin" />
  if (requireAdmin && !isAdmin) return <Navigate to="/exchange" />

  return children
}

function AppContent() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white selection:bg-[#FCD535]/30 overflow-x-hidden">
      <Navbar />
      <Toaster position="top-right" />
      
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* USER EXCHANGE FLOW - Responsive Padding */}
        <Route path="/exchange" element={
          <ProtectedRoute>
            <div className="max-w-4xl mx-auto px-4 py-8 md:p-10">
              <header className="mb-6 md:mb-10 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-black text-[#FCD535] uppercase italic tracking-tighter">Fast Swap</h1>
                <p className="text-gray-500 text-[10px] md:text-sm font-bold uppercase tracking-widest mt-1">Direct platform-to-user settlement</p>
              </header>
              <Home /> 
            </div>
          </ProtectedRoute>
        } />

        {/* USER ACCOUNT ROUTES */}
        <Route path="/trade/:tradeId" element={<ProtectedRoute><TradeStatus /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
        <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

        {/* ADMIN MANAGEMENT ROUTES - Stacking Header on Mobile */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <div className="max-w-7xl mx-auto px-3 py-6 md:p-6">
              <header className="mb-6 flex flex-col md:flex-row justify-between items-center bg-[#161A1E] p-5 md:p-6 rounded-3xl border border-zinc-800 gap-4 text-center md:text-left">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-[#FCD535] uppercase italic tracking-tighter">Admin Command Center</h1>
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Platform Liquidity & Verification</p>
                </div>
                <div className="hidden md:block h-8 w-[1px] bg-zinc-800 mx-4"></div>
                <p className="text-[10px] text-zinc-600 font-black uppercase md:ml-auto">Active Session</p>
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