import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AlertCircle, ArrowLeft, User, Mail, Phone, Lock, ShieldCheck, ArrowRight, Zap, CheckCircle } from 'lucide-react'

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
    <div className="min-h-screen bg-white text-gray-900 font-sans flex items-center justify-center px-4 py-8 selection:bg-blue-100">
      
      {/* Background Subtle Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-100/30 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-500 relative z-10">
        
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-200 text-xl">D</div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase italic text-gray-900">DubaiP2P</h1>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">
            {step === 1 ? 'Create Your Account' : 'Verify Your Email'}
          </h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
            Institutional Grade P2P Security
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/50">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-xs font-bold text-red-600 uppercase tracking-wide">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleInitiateSignup} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Username */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">Username</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      placeholder="Display name"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">Phone</label>
                  <div className="relative group">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      placeholder="+91..."
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    placeholder="Min. 6 characters"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <CheckCircle size={14} className="text-blue-600" />
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Secure AES-256 Encryption Enabled</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-blue-200 mt-4"
              >
                {loading ? 'Processing...' : 'Register Now'} <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center bg-blue-50 p-4 rounded-2xl border border-blue-200">
                <p className="text-gray-600 text-sm">Verification code sent to:</p>
                <p className="text-gray-900 font-bold tracking-tight">{email}</p>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-3 font-black text-center">Enter 6-Digit Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-3xl text-blue-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-black tracking-[0.4em] text-center"
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
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Resend OTP Code
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
              >
                {loading ? 'Verifying...' : 'Verify & Dashboard'}
              </button>

              <button type="button" onClick={handleBack} className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-[10px] font-black uppercase tracking-widest mt-2 transition-colors">
                <ArrowLeft size={14} /> Back to Details
              </button>
            </form>
          )}

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
              <span className="px-4 bg-white text-gray-500 italic flex items-center gap-1">
                <Zap size={10} fill="currentColor" className="text-blue-600" /> Encrypted Node
              </span>
            </div>
          </div>

          <p className="text-center text-gray-500 text-[10px] font-black uppercase tracking-widest">
            Already a Trader? <Link to="/login" className="text-blue-600 hover:text-blue-700 ml-1 transition-colors">Sign In</Link>
          </p>
        </div>

        <div className="mt-8 flex justify-center items-center gap-6 opacity-50 hover:opacity-100 transition-all">
           <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-tighter text-gray-600"><ShieldCheck size={12} className="text-blue-600"/> PCI-DSS</div>
           <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-tighter text-gray-600"><Lock size={12} className="text-blue-600"/> SSL Secure</div>
           <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-tighter text-gray-600"><Zap size={12} className="text-blue-600"/> Instant</div>
        </div>
      </div>
    </div>
  )
}