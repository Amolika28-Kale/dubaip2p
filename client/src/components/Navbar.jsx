import React, { useContext, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { LogOut, Menu, X, ChevronDown, History, Users, Star, LayoutDashboard, User as UserIcon, ShieldCheck, ArrowRightLeft } from 'lucide-react'
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

  const isActive = (path) => location.pathname === path ? 'text-[#FCD535]' : 'text-gray-400 hover:text-white'

  if (['/', '/login', '/signup' , '/forgot-password'].includes(location.pathname)) return null

  return (
    <nav className="bg-[#0B0E11] border-b border-zinc-800 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-6">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">D</div>
            <span className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter shrink-0">
              DubaiP2P
            </span>
          <div className="hidden sm:block">
            <OperatorStatusBadge />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {!isAdmin && (
            <Link to="/exchange" className={`${isActive('/exchange')} text-sm font-bold transition`}>
              Exchange
            </Link>
          )}

          {isAdmin && (
            <div className="flex items-center gap-6">
              <Link to="/admin" className={`${isActive('/admin')} text-sm font-bold flex items-center gap-2`}>
                <ShieldCheck size={16} /> Dashboard
              </Link>
              <Link to="/admin/master" className={`${isActive('/admin/master')} text-sm font-bold`}>
                 Settings
              </Link>
            </div>
          )}

          {isAuthenticated && !isAdmin && (
            <div className="relative">
              <button 
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700 transition"
              >
                <UserIcon size={16} className="text-[#FCD535]" />
                <span className="text-sm font-bold text-gray-200">My Account</span>
                <ChevronDown size={14} className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden py-1">
                   <Link to="/dashboard" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-zinc-800 transition">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link to="/history" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-zinc-800 transition">
                    <History size={16} /> My Exchanges
                  </Link>
                  <Link to="/referral" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-zinc-800 transition">
                    <Users size={16} /> My Referrals
                  </Link>
                  <Link to="/reviews" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-zinc-800 transition">
                    <Star size={16} /> My Reviews
                  </Link>
                  <div className="border-t border-zinc-800 my-1"></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {isAdmin && (
            <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition border border-zinc-800 ml-2">
              <LogOut size={18} />
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle - Enhanced for Touch */}
        <div className="flex items-center gap-3 md:hidden">
          <OperatorStatusBadge />
          <button onClick={() => setMenuOpen(true)} className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-white active:scale-90 transition-transform">
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Full Screen Mobile Sidebar Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden overflow-hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-[#0B0E11] border-l border-zinc-800 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800">
<span className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter shrink-0">
              DubaiP2P
            </span>              <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
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
                  <MobileLink to="/history" icon={<History size={18}/>} label="History" onClick={() => setMenuOpen(false)} active={location.pathname === '/history'} />
                  <MobileLink to="/referral" icon={<Users size={18}/>} label="Referrals" onClick={() => setMenuOpen(false)} active={location.pathname === '/referral'} />
                  <MobileLink to="/reviews" icon={<Star size={18}/>} label="Reviews" onClick={() => setMenuOpen(false)} active={location.pathname === '/reviews'} />
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
            className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all font-bold ${active ? 'bg-blue-600 text-black shadow-lg shadow-yellow-500/10' : 'text-gray-400 hover:bg-zinc-800/50'}`}
        >
            {icon}
            <span className="text-sm uppercase tracking-wider">{label}</span>
        </Link>
    )
}