import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ArrowRight, Shield, Zap, Globe, TrendingUp, Users, Star } from 'lucide-react'
import LiveReserveWidget from '../components/LiveReserveWidget'
import LatestExchangesTicker from '../components/LatestExchangesTicker'

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AuthContext)
  const [rate, setRate] = useState(82.5)
  const [latestTrades, setLatestTrades] = useState([])
  const [reserves, setReserves] = useState({})
  const [fiatAmount, setFiatAmount] = useState(1000)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [rateRes, tradesRes, reservesRes] = await Promise.all([
        fetch('https://dubaip2p.onrender.com/api/exchange/rate'),
        fetch('https://dubaip2p.onrender.com/api/exchange/latest?limit=5'),
        fetch('https://dubaip2p.onrender.com/api/exchange/reserves')
      ])
      
      if (rateRes.ok) {
        const rateData = await rateRes.json()
        setRate(rateData.rate || 82.5)
      }
      if (tradesRes.ok) {
        const tradesData = await tradesRes.json()
        setLatestTrades(tradesData.trades || [])
      }
      if (reservesRes.ok) {
        const reservesData = await reservesRes.json()
        setReserves(reservesData.reserves || {})
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const cryptoAmount = (fiatAmount / rate).toFixed(4)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl font-bold mb-4">
              <span className="text-[#FCD535]">DubaiP2P</span>
              <br />
              Direct P2P Exchange
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Trade INR to USDT instantly. No middleman, no fees, pure peer-to-peer exchange with real-time rates.
            </p>
            <div className="flex gap-4 mb-12 flex-wrap">
              <button
                onClick={() => navigate(isAuthenticated ? '/exchange' : '/signup')}
                className="px-8 py-3 bg-[#FCD535] text-black font-bold rounded-lg hover:bg-yellow-400 flex items-center gap-2 transition"
              >
                Get Started <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 border border-[#FCD535] text-[#FCD535] font-bold rounded-lg hover:bg-[#FCD535] hover:text-black transition"
              >
                Sign In
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-[#FCD535]">2,847</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                <p className="text-gray-400 text-sm">Trades Done</p>
                <p className="text-2xl font-bold text-[#FCD535]">12,456</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                <p className="text-gray-400 text-sm">Volume (24h)</p>
                <p className="text-2xl font-bold text-[#FCD535]">₹4.2Cr</p>
              </div>
            </div>
          </div>

          {/* Live Calculator */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-[#FCD535]/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Live Exchange</h3>
            
            <div className="bg-black/50 p-4 rounded-lg mb-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Current Rate</p>
              <p className="text-4xl font-bold text-[#FCD535]">₹{rate.toFixed(2)}</p>
              <p className="text-gray-400 text-sm mt-2">= 1 USDT</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Send (INR)</label>
                <input
                  type="number"
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg focus:border-[#FCD535] focus:outline-none text-white"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Receive (USDT)</label>
                <input
                  type="text"
                  value={cryptoAmount}
                  readOnly
                  className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                />
              </div>
            </div>

            <button
              onClick={() => navigate(isAuthenticated ? '/exchange' : '/login')}
              className="w-full py-3 bg-[#FCD535] text-black font-bold rounded-lg hover:bg-yellow-400 transition"
            >
              {isAuthenticated ? 'Start Exchange' : 'Login to Exchange'}
            </button>
          </div>
          <div className="mt-6">
            <LiveReserveWidget />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose DubaiP2P?</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-lg hover:border-[#FCD535] transition">
            <Zap className="text-[#FCD535] mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Instant Settlement</h3>
            <p className="text-gray-400">Receive crypto in seconds</p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-lg hover:border-[#FCD535] transition">
            <Shield className="text-[#FCD535] mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Secure & Safe</h3>
            <p className="text-gray-400">Multi-layer protection</p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-lg hover:border-[#FCD535] transition">
            <TrendingUp className="text-[#FCD535] mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Best Rates</h3>
            <p className="text-gray-400">Real-time pricing</p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-lg hover:border-[#FCD535] transition">
            <Users className="text-[#FCD535] mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Trusted</h3>
            <p className="text-gray-400">2,800+ active users</p>
          </div>
        </div>
      </div>

      {/* Reserves Section */}
      {Object.keys(reserves).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <h2 className="text-4xl font-bold mb-10 text-center">Our Reserves</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {Object.entries(reserves).map(([key, value]) => (
              <div key={key} className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg text-center">
                <p className="text-gray-400 text-sm mb-2">{key}</p>
                <p className="text-3xl font-bold text-[#FCD535]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Exchanges */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold mb-10">Latest Exchanges</h2>
        <LatestExchangesTicker />
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { num: '1', title: 'Create Account', desc: 'Sign up in 2 minutes' },
            { num: '2', title: 'Verify Identity', desc: 'Quick verification' },
            { num: '3', title: 'Initiate Trade', desc: 'Set amount & wallet' },
            { num: '4', title: 'Receive USDT', desc: 'Instant settlement' }
          ].map((step, idx) => (
            <div key={idx}>
              <div className="bg-[#FCD535] text-black w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                {step.num}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">What Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Raj Kumar', text: 'Best P2P exchange I\'ve used. Quick and reliable!' },
            { name: 'Priya Singh', text: 'Amazing rates and instant settlement. Highly recommended!' },
            { name: 'Amit Patel', text: 'Great support and secure platform. 5 stars!' }
          ].map((testimonial, idx) => (
            <div key={idx} className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-lg hover:border-[#FCD535] transition">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#FCD535] text-[#FCD535]" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
              <p className="font-bold text-[#FCD535]">— {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Start Trading?</h2>
        <p className="text-xl text-gray-400 mb-8">Join thousands of users trading on DubaiP2P today</p>
        <button
          onClick={() => navigate(isAuthenticated ? '/exchange' : '/signup')}
          className="px-12 py-4 bg-[#FCD535] text-black font-bold text-lg rounded-lg hover:bg-yellow-400 transition inline-flex items-center gap-2"
        >
          Get Started Now <ArrowRight size={20} />
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-[#FCD535] mb-4">DubaiP2P</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#FCD535]">About Us</a></li>
                <li><a href="#" className="hover:text-[#FCD535]">Blog</a></li>
                <li><a href="#" className="hover:text-[#FCD535]">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#FCD535] mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#FCD535]">P2P Exchange</a></li>
                <li><a href="#" className="hover:text-[#FCD535]">API</a></li>
                <li><a href="#" className="hover:text-[#FCD535]">Rates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#FCD535] mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#FCD535]">Help Center</a></li>
                <li><a href="#" className="hover:text-[#FCD535]">Contact</a></li>
                <li><a href="#" className="hover:text-[#FCD535]">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#FCD535] mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#FCD535]">Terms</a></li>
                <li><a href="#" className="hover:text-[#FCD535]">Privacy</a></li>
                <li><a href="#" className="hover:text-[#FCD535]">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2025 DubaiP2P. All rights reserved. | Secure P2P Exchange Platform</p>
          </div>
        </div>
      </div>
    </div>
  )
}
