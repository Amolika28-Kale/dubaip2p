import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AlertCircle } from 'lucide-react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password || !username) {
      setError('All fields required')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const success = await signup(email, password, username)
    if (success) {
      navigate('/exchange')
    } else {
      setError('Signup failed. Email may already be registered.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#FCD535] mb-2">DubaiP2P</h1>
          <p className="text-gray-400">Create your account</p>
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

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
