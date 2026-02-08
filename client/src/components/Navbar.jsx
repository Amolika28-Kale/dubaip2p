import React, { useContext, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { LogOut, Menu, X, ChevronDown, History, Users, Star, LayoutDashboard, User as UserIcon, ShieldCheck } from 'lucide-react'
import OperatorStatusBadge from './OperatorStatusBadge'

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext)
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

  // Hide navbar on auth pages
  if (['/', '/login', '/signup'].includes(location.pathname)) return null

  return (
    <nav className="bg-[#0B0E11] border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-black text-[#FCD535] uppercase italic tracking-tighter">
            DubaiP2P
          </Link>
          <div className="hidden sm:block">
            <OperatorStatusBadge />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* SHARED LINKS */}
          {/* <Link to="/exchange" className={`${isActive('/exchange')} text-sm font-bold transition`}>
            Exchange
          </Link> */}

          {/* ADMIN SPECIFIC LINKS */}
          {isAdmin && (
            <div className="flex items-center gap-6 border-l border-zinc-800 pl-6">
              <Link to="/admin" className={`${isActive('/admin')} text-sm font-bold flex items-center gap-2`}>
                <ShieldCheck size={16} /> Dashboard
              </Link>
              <Link to="/admin/master" className={`${isActive('/admin/master')} text-sm font-bold`}>
                 Settings
              </Link>
            </div>
          )}

          {/* USER SPECIFIC DROPDOWN (Mirroring inr2usdt.com) */}
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

          {/* ADMIN LOGOUT (Simple Button) */}
          {isAdmin && (
            <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition">
              <LogOut size={18} />
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 p-4 space-y-2">
          <Link to="/exchange" className="block p-3 text-gray-300 font-bold" onClick={() => setMenuOpen(false)}>Exchange</Link>
          {isAdmin ? (
            <>
              <Link to="/admin" className="block p-3 text-yellow-500 font-bold" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
              <Link to="/admin/master" className="block p-3 text-gray-300 font-bold" onClick={() => setMenuOpen(false)}>Master Settings</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="block p-3 text-gray-300" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/history" className="block p-3 text-gray-300" onClick={() => setMenuOpen(false)}>History</Link>
              <Link to="/referral" className="block p-3 text-gray-300" onClick={() => setMenuOpen(false)}>Referrals</Link>
            </>
          )}
          <button onClick={handleLogout} className="w-full text-left p-3 text-red-500 font-bold">Logout</button>
        </div>
      )}
    </nav>
  )
}