import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AlertCircle, ArrowLeft, User, Mail, Phone, Lock, ShieldCheck, ArrowRight } from 'lucide-react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { initiateOtpSignup, verifyOtpSignup, resendSignupOtp } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleInitiateSignup = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)

    if (!email || !password || !username || !phone) {
      setError('All fields required'); setLoading(false); return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters'); setLoading(false); return
    }

    const result = await initiateOtpSignup(username, email, phone, password)
    if (result.success) {
      setStep(2)
    } else {
      setError(result.error || 'Failed to send OTP')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const result = await verifyOtpSignup(email, otp)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'OTP verification failed')
    }
    setLoading(false)
  }

  const handleBack = () => {
    setStep(1); setOtp(''); setError('')
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-[#FCD535] uppercase italic tracking-tighter mb-2">
            DubaiP2P
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-widest">
            {step === 1 ? 'Create Account' : 'Verify Identity'}
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-[#161A1E] border border-zinc-800 rounded-[2rem] p-6 md:p-10 shadow-2xl">
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-xs font-bold text-red-400 uppercase tracking-tight">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleInitiateSignup} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">Username</label>
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FCD535] transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white outline-none focus:border-yellow-500/50 transition-all font-medium"
                    placeholder="Display name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">Email</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FCD535] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white outline-none focus:border-yellow-500/50 transition-all font-medium"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FCD535] transition-colors" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white outline-none focus:border-yellow-500/50 transition-all font-medium"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FCD535] transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white outline-none focus:border-yellow-500/50 transition-all font-medium"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#FCD535] text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-yellow-400 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-yellow-500/10 mt-6"
              >
                {loading ? 'Processing...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Sent a code to <span className="text-white font-bold">{email}</span></p>
                <p className="text-gray-600 text-[10px] uppercase font-black tracking-tighter mt-1">(Check Inbox & Spam)</p>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black text-center">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xl md:text-2xl text-[#FCD535] outline-none focus:border-yellow-500/50 transition-all font-black tracking-[0.5em] text-center"
                  placeholder="000000"
                />
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={async () => {
                    const r = await resendSignupOtp(email)
                    if (!r.success) setError(r.error)
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-[#FCD535] transition-colors"
                >
                  Resend Verification Code
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Complete Registration'}
              </button>

              <button type="button" onClick={handleBack} className="w-full flex items-center justify-center gap-2 text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest mt-4 transition-colors">
                <ArrowLeft size={14} /> Back to Details
              </button>
            </form>
          )}

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="px-4 bg-[#161A1E] text-zinc-600">Secure Node</span>
            </div>
          </div>

          <p className="text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            Already Member? <Link to="/login" className="text-[#FCD535] hover:text-yellow-400 ml-1 underline decoration-yellow-500/30 underline-offset-4">Sign In</Link>
          </p>
        </div>

        <p className="text-center text-[9px] text-zinc-700 mt-8 uppercase font-bold tracking-[0.2em]">
          By continuing, you agree to our Terms of Service & Privacy Protocol
        </p>
      </div>
    </div>
  )
}