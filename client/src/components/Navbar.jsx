import React, { useContext, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { 
  LogOut, Menu, X, ChevronDown, History, Users, Star, 
  LayoutDashboard, User as UserIcon, ShieldCheck, ArrowRightLeft,
} from 'lucide-react'
import OperatorStatusBadge from './OperatorStatusBadge'

export default function Navbar() {
  const { logout, isAuthenticated, isAdmin } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
    setAccountOpen(false)
  }

  // Active state logic to match MEXC/Transactify tab style
  const isActive = (path) => location.pathname === path 
    ? 'text-white border-b-2 border-blue-500 bg-white/5' 
    : 'text-gray-400 hover:text-white hover:bg-white/5'

  if (['/', '/login', '/signup' , '/forgot-password'].includes(location.pathname)) return null

  return (
    <nav className="bg-[#0b0e11] border-b border-gray-800 sticky top-0 z-[100] font-sans">
      <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-between h-[64px]">
        
        {/* LEFT SECTION: Logo & Main Navigation Tabs */}
        <div className="flex items-center h-full gap-2">
          {/* Logo Section */}
          <div className="flex items-center gap-2 mr-6 cursor-pointer group" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105">D</div>
            <span className="text-xl font-bold text-white tracking-tighter uppercase italic hidden lg:block">
              DubaiP2P
            </span>
          </div>

          {/* Desktop Tabs - Transactify/MEXC Style */}
          <div className="hidden md:flex items-center h-full">
            {!isAdmin ? (
              <>
                <Link to="/dashboard" className={`px-4 h-full flex items-center text-[13px] font-bold transition-all ${isActive('/dashboard')}`}>
                  Dashboard
                </Link>
                <Link to="/exchange" className={`px-4 h-full flex items-center text-[13px] font-bold transition-all ${isActive('/exchange')}`}>
                  Exchange
                </Link>
                <Link to="/history" className={`px-4 h-full flex items-center text-[13px] font-bold transition-all ${isActive('/history')}`}>
                  Orders
                </Link>
                <Link to="/referral" className={`px-4 h-full flex items-center text-[13px] font-bold transition-all ${isActive('/referral')}`}>
                  Referrals
                </Link>
                <Link to="/reviews" className={`px-4 h-full flex items-center text-[13px] font-bold transition-all ${isActive('/reviews')}`}>
                  Feedbacks
                </Link>
              </>
            ) : (
              <>
                <Link to="/admin" className={`px-4 h-full flex items-center text-[13px] font-bold transition-all ${isActive('/admin')}`}>
                  <ShieldCheck size={16} className="mr-2" /> Admin Terminal
                </Link>
                <Link to="/admin/master" className={`px-4 h-full flex items-center text-[13px] font-bold transition-all ${isActive('/admin/master')}`}>
                  System Settings
                </Link>
              </>
            )}
          </div>
        </div>

        {/* RIGHT SECTION: Account & Status */}
        <div className="flex items-center gap-4">
         

          <div className="hidden sm:block">
            <OperatorStatusBadge />
          </div>

          {/* User Account Dropdown */}
          {isAuthenticated && (
            <div className="relative">
              <button 
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 bg-[#181a20] px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700 transition-all active:scale-95"
              >
                <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <UserIcon size={14} className="text-blue-500" />
                </div>
                <span className="text-[12px] font-black text-gray-200 uppercase tracking-tighter hidden md:block">Account</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#181a20] border border-gray-800 rounded-xl shadow-2xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
                  <div className="px-4 py-3 border-b border-gray-800 bg-[#0b0e11]/50">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Connected Node</p>
                    <p className="text-xs font-bold text-white truncate italic uppercase tracking-tighter">Verified Merchant</p>
                  </div>
                  
                  <Link to="/dashboard" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-blue-500 transition">
                    <LayoutDashboard size={16} /> User Panel
                  </Link>
                  
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-500/10 transition">
                    <LogOut size={16} /> Secure Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button - Kept separate as per requirement */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(true)} className="p-2 bg-[#181a20] rounded-lg border border-gray-800 text-white active:scale-90 transition-transform">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR (Already working as per your original code) */}
      {menuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden overflow-hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-[#0b0e11] border-l border-gray-800 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
              <span className="text-xl font-black text-white uppercase italic tracking-tighter">DubaiP2P</span>
              <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white p-1"><X size={24} /></button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto">
              {!isAdmin && (
                <MobileLink to="/exchange" icon={<ArrowRightLeft size={18}/>} label="Exchange" onClick={() => setMenuOpen(false)} active={location.pathname === '/exchange'} />
              )}
              {isAdmin ? (
                <>
                  <MobileLink to="/admin" icon={<ShieldCheck size={18}/>} label="Dashboard" onClick={() => setMenuOpen(false)} active={location.pathname === '/admin'} />
                  <MobileLink to="/admin/master" icon={<LayoutDashboard size={18}/>} label="Settings" onClick={() => setMenuOpen(false)} active={location.pathname === '/admin/master'} />
                </>
              ) : (
                <>
                  <MobileLink to="/dashboard" icon={<LayoutDashboard size={18}/>} label="Dashboard" onClick={() => setMenuOpen(false)} active={location.pathname === '/dashboard'} />
                  <MobileLink to="/history" icon={<History size={18}/>} label="Orders" onClick={() => setMenuOpen(false)} active={location.pathname === '/history'} />
                  <MobileLink to="/referral" icon={<Users size={18}/>} label="Referrals" onClick={() => setMenuOpen(false)} active={location.pathname === '/referral'} />
                  <MobileLink to="/reviews" icon={<Star size={18}/>} label="Feedbacks" onClick={() => setMenuOpen(false)} active={location.pathname === '/reviews'} />
                </>
              )}
            </div>
            <button onClick={handleLogout} className="mt-auto flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-xs active:scale-95 transition-transform">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

function MobileLink({ to, icon, label, onClick, active }) {
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all font-bold ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
    >
      {icon}
      <span className="text-sm uppercase tracking-wider">{label}</span>
    </Link>
  )
}