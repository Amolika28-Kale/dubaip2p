import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Email and password required')
      setLoading(false)
      return
    }

    const result = await login(email, password)
    if (result === true) {
      navigate('/dashboard')
    } else {
      setError(result || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        
        {/* Branding - Mobile Optimized Sizes */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-[#FCD535] uppercase italic tracking-tighter mb-2">
            DubaiP2P
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-widest">
            Institutional Grade Exchange
          </p>
        </div>

        {/* Login Card - Consistent 3xl Rounded Style */}
        <div className="bg-[#161A1E] border border-zinc-800 rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-black/50">
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-1">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-xs font-bold text-red-400 uppercase tracking-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FCD535] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white outline-none focus:border-yellow-500/50 transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">
                Security Password
              </label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FCD535] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white outline-none focus:border-yellow-500/50 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex justify-end pr-1">
              <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-[#FCD535] hover:text-yellow-400 transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#FCD535] text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-yellow-400 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-yellow-500/10 mt-6"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Enter Dashboard <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="px-4 bg-[#161A1E] text-zinc-600">New to Platform?</span>
            </div>
          </div>

          <p className="text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            No account?{' '}
            <Link to="/signup" className="text-[#FCD535] hover:text-yellow-400 transition-colors ml-1 underline decoration-yellow-500/30 underline-offset-4">
              Register ID
            </Link>
          </p>
        </div>

        {/* Footer info - Mobile responsive */}
        <p className="text-center text-[9px] text-zinc-600 mt-8 uppercase font-bold tracking-[0.2em]">
          Secure P2P Node • Encrypted Connection
        </p>
      </div>
    </div>
  )
}