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

  // Active state logic for light theme
  const isActive = (path) => location.pathname === path 
    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'

  if (['/', '/login', '/signup', '/forgot-password'].includes(location.pathname)) return null

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-[100] font-sans shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-between h-[64px]">
        
        {/* LEFT SECTION: Logo & Main Navigation Tabs */}
        <div className="flex items-center h-full gap-2">
          {/* Logo Section */}
          <div className="flex items-center gap-2 mr-6 cursor-pointer group" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-200 transition-transform group-hover:scale-105">D</div>
            <span className="text-xl font-bold text-gray-900 tracking-tighter uppercase italic hidden lg:block">
              DubaiP2P
            </span>
          </div>

          {/* Desktop Tabs */}
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
                className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-white transition-all active:scale-95"
              >
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon size={14} className="text-blue-600" />
                </div>
                <span className="text-[12px] font-black text-gray-700 uppercase tracking-tighter hidden md:block">Account</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
                 
                
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition">
                    <LogOut size={16} /> Secure Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(true)} className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 active:scale-90 transition-transform hover:bg-gray-100">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      {menuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white border-l border-gray-200 p-6 flex flex-col shadow-xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <span className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">DubaiP2P</span>
              <button onClick={() => setMenuOpen(false)} className="text-gray-500 hover:text-gray-900 p-1"><X size={24} /></button>
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
            <button onClick={handleLogout} className="mt-auto flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-red-50 border border-red-200 text-red-500 font-black uppercase tracking-widest text-xs active:scale-95 transition-transform hover:bg-red-100">
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
      className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all font-bold ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      {icon}
      <span className="text-sm uppercase tracking-wider">{label}</span>
    </Link>
  )
}