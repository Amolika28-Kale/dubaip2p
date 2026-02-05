import React, { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { LogOut, Menu, X } from 'lucide-react'
import OperatorStatusBadge from './OperatorStatusBadge'

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path ? 'text-[#FCD535]' : 'text-gray-400 hover:text-white'

  // Hide navbar on landing, login, signup pages
  const hiddenPaths = ['/', '/login', '/signup']
  if (hiddenPaths.includes(location.pathname)) return null

  return (
    <nav className="bg-black border-b border-zinc-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-[#FCD535]">
          DubaiP2P
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/exchange" className={`${isActive('/exchange')} transition`}>
            Exchange
          </Link>
          <OperatorStatusBadge />
          <Link to="/history" className={`${isActive('/history')} transition`}>
            History
          </Link>
          <Link to="/referral" className={`${isActive('/referral')} transition`}>
            Referral
          </Link>
          <Link to="/reviews" className={`${isActive('/reviews')} transition`}>
            Reviews
          </Link>
          {isAdmin && (
            <Link to="/admin" className={`${isActive('/admin')} transition`}>
              Admin
            </Link>
          )}

          {isAuthenticated && (
            <>
              <div className="flex items-center gap-3 px-3 py-1 bg-zinc-900 rounded-lg">
                <span className="text-sm text-gray-400">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-400 hover:text-[#FCD535] transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white hover:text-[#FCD535]"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 p-4 space-y-3">
          <Link to="/exchange" className="block text-gray-400 hover:text-[#FCD535]" onClick={() => setMenuOpen(false)}>
            Exchange
          </Link>
          {isAdmin && (
            <Link to="/admin" className="block text-gray-400 hover:text-[#FCD535]" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          )}
          {isAuthenticated && (
            <>
              <div className="py-2 text-sm text-gray-400">{user?.username}</div>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 text-gray-400 hover:text-[#FCD535] transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
