import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AlertCircle } from 'lucide-react'

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
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#FCD535] mb-2">DubaiP2P</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg flex gap-2">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-[#FCD535] focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
<Link to="/forgot-password" className="text-sm text-[#FCD535] hover:underline">
  Forgot password?
</Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FCD535] text-black py-3 rounded-lg font-semibold hover:bg-[#FCD535]/90 disabled:opacity-50 mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-900 text-gray-500">OR</span>
            </div>
          </div>


          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#FCD535] hover:underline">
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
