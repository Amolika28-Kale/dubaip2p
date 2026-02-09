import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { initiateOtpSignup, verifyOtpSignup } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleInitiateSignup = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password || !username || !phone) {
      setError('All fields required')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

const result = await initiateOtpSignup(
  username, // backend expects name
  email,
  phone,
  password
)
    if (result.success) {
      console.log(result)

      setStep(2)
    } else {
      setError(result.error || 'Failed to send OTP')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

const result = await verifyOtpSignup(email, otp)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'OTP verification failed')
    }
    setLoading(false)
  }

  const handleBack = () => {
    setStep(1)
    setOtp('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#FCD535] mb-2">DubaiP2P</h1>
          <p className="text-gray-400">
            {step === 1 ? 'Create your account' : 'Verify your phone number'}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg flex gap-2">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleInitiateSignup} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-[#FCD535] focus:outline-none"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-[#FCD535] focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-[#FCD535] focus:outline-none"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-[#FCD535] focus:outline-none"
                  placeholder="Min 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FCD535] text-black py-3 rounded-lg font-semibold hover:bg-[#FCD535]/90 disabled:opacity-50 mt-6"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-400 text-sm">
                  We've sent a 6-digit code to {phone}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-[#FCD535] focus:outline-none text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
<button
  type="button"
  onClick={async () => {
    const r = await resendSignupOtp(email)
    if (!r.success) setError(r.error)
  }}
  className="text-sm text-[#FCD535] hover:underline mt-2"
>
  Resend OTP
</button>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#FCD535] text-black py-3 rounded-lg font-semibold hover:bg-[#FCD535]/90 disabled:opacity-50 mt-6"
              >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white mt-4"
              >
                <ArrowLeft size={16} />
                Back to form
              </button>
            </form>
          )}

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FCD535] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          By signing up, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}
