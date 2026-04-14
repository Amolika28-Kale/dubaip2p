import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AlertCircle, Lock, Mail, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

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
    <div className="min-h-screen bg-white text-gray-900 font-sans flex items-center justify-center px-4 py-8 selection:bg-blue-100">
      
      {/* Background Glow Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-100/30 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
        
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-200 text-xl">D</div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase italic text-gray-900">DubaiP2P</h1>
          </div>
          <h2 className="text-xl font-bold mb-1 text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
            Institutional Grade Security Enabled
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-200/50">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-1">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-xs font-bold text-red-600 uppercase tracking-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
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
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex justify-end pr-1">
              <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-blue-200 mt-6"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Enter Dashboard <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
              <span className="px-4 bg-white text-gray-500 flex items-center gap-1">
                <Zap size={10} fill="currentColor" className="text-blue-600"/> New Trader?
              </span>
            </div>
          </div>

          <p className="text-center text-gray-500 text-[10px] font-black uppercase tracking-widest">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 transition-colors ml-1 underline decoration-blue-200 underline-offset-4">
              Register ID
            </Link>
          </p>
        </div>

        {/* Security Badges */}
        <div className="mt-10 flex justify-center items-center gap-6 opacity-50 hover:opacity-100 transition-all">
           <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-tighter text-gray-600"><ShieldCheck size={14} className="text-blue-600"/> AES-256 Secure</div>
           <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-tighter text-gray-600"><Lock size={14} className="text-blue-600"/> SSL Encryption</div>
        </div>
      </div>
    </div>
  )
}