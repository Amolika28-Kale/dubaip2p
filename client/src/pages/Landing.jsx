import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  Clock,
  Wallet
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { getExchangeRate } from '../services/exchangeService'
import LiveReserveWidget from '../components/LiveReserveWidget'
import LatestExchangesTicker from '../components/LatestExchangesTicker'
import { getReviews } from '../services/reviewService'


export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AuthContext)

  const [rate, setRate] = useState(82.5)
  const [fiatAmount, setFiatAmount] = useState(1000)
  const [reviews, setReviews] = useState([])


useEffect(() => {
  const fetchRate = async () => {
    try {
      const d = await getExchangeRate()
      setRate(d.rate || 82.5)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchReviews = async () => {
    try {
      const d = await getReviews()
      setReviews(d.reviews || [])
    } catch (e) {
      console.error(e)
    }
  }

  fetchRate()
  fetchReviews()
}, [])


  const cryptoAmount = (fiatAmount / rate).toFixed(4)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(252,213,53,0.15),_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-14 relative z-10">

          {/* LEFT */}
          <div>
            <h1 className="text-6xl font-extrabold leading-tight mb-6">
              <span className="text-[#FCD535]">DubaiP2P</span>
              <br />
              Secure INR → USDT Exchange
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-xl">
              Trusted peer-to-peer crypto exchange with instant settlement,
              escrow protection and real-time rates.
            </p>

            <div className="flex gap-4 flex-wrap mb-10">
              <button
                onClick={() => navigate(isAuthenticated ? '/exchange' : '/signup')}
                className="px-8 py-4 bg-[#FCD535] text-black font-bold rounded-xl hover:bg-yellow-400 transition flex items-center gap-2"
              >
                Start Trading <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 border border-[#FCD535] text-[#FCD535] font-bold rounded-xl hover:bg-[#FCD535] hover:text-black transition"
              >
                Sign In
              </button>
            </div>

            {/* TRUST STRIP */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="text-green-400" size={16} /> Escrow Protected
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-400" size={16} /> Avg 3 min settlement
              </div>
              <div className="flex items-center gap-2">
                <Globe className="text-blue-400" size={16} /> TRC20 • BEP20
              </div>
            </div>
          </div>

          {/* RIGHT – LIVE CALCULATOR */}
          <div className="bg-zinc-900/80 border border-[#FCD535]/30 rounded-3xl p-8 backdrop-blur">
            <h3 className="text-2xl font-bold mb-6">Live Exchange Calculator</h3>

            <div className="text-center bg-black/50 p-6 rounded-xl mb-6">
              <p className="text-sm text-gray-400 mb-2">Current Rate</p>
              <p className="text-4xl font-bold text-[#FCD535]">
                ₹{rate.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1">1 USDT</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300">You Send (INR)</label>
                <input
                  value={fiatAmount}
                  onChange={e => setFiatAmount(+e.target.value || 0)}
                  className="w-full mt-1 p-3 bg-zinc-800 border border-zinc-700 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">You Receive (USDT)</label>
                <input
                  value={cryptoAmount}
                  readOnly
                  className="w-full mt-1 p-3 bg-zinc-800 border border-zinc-700 rounded-lg opacity-70"
                />
              </div>
            </div>

            <button
              onClick={() => navigate(isAuthenticated ? '/exchange' : '/login')}
              className="w-full mt-6 py-3 bg-[#FCD535] text-black font-bold rounded-lg hover:bg-yellow-400"
            >
              {isAuthenticated ? 'Proceed to Exchange' : 'Login to Trade'}
            </button>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-6">
        {[
          ['2,800+', 'Active Users'],
          ['12,500+', 'Trades Completed'],
          ['₹4.2 Cr', '24h Volume'],
          ['99.3%', 'Success Rate']
        ].map(([value, label]) => (
          <div key={label} className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-[#FCD535]">{value}</p>
            <p className="text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* ================= WHY TRUST ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why Traders Trust DubaiP2P
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'Escrow Security',
              desc: 'Funds locked until payment verification'
            },
            {
              icon: Clock,
              title: 'Fast Settlement',
              desc: 'Most trades complete within minutes'
            },
            {
              icon: Wallet,
              title: 'Manual Fraud Checks',
              desc: 'Human-verified transactions'
            }
          ].map((f, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-700 p-8 rounded-xl hover:border-[#FCD535] transition">
              <f.icon className="text-[#FCD535] mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LIVE WIDGETS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 gap-10">
        {/* <LiveReserveWidget /> */}
        <LatestExchangesTicker />
      </section>

{/* ================= TESTIMONIALS ================= */}
<section className="max-w-7xl mx-auto px-6 py-20">
  <h2 className="text-4xl font-bold text-center mb-16">
    Trusted by Real Traders
  </h2>

  {reviews.length === 0 ? (
    <p className="text-center text-gray-500">No reviews yet</p>
  ) : (
    <div className="grid md:grid-cols-3 gap-8">
      {reviews.slice(0, 6).map((r) => (
        <div
          key={r._id}
          className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl"
        >
          <div className="flex mb-3">
            {[...Array(r.rating || 5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className="fill-[#FCD535] text-[#FCD535]"
              />
            ))}
          </div>

          <p className="text-gray-300 mb-4">
            "{r.text}"
          </p>

          <p className="font-bold text-[#FCD535]">
            — {r.username}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {new Date(r.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )}
</section>


      {/* ================= FINAL CTA ================= */}
      <section className="text-center py-24 bg-gradient-to-r from-[#FCD535]/10 to-transparent">
        <h2 className="text-4xl font-extrabold mb-6">
          Start Your First Trade in 2 Minutes
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          No fees • Instant settlement • 100% secure
        </p>
        <button
          onClick={() => navigate(isAuthenticated ? '/exchange' : '/signup')}
          className="px-12 py-4 bg-[#FCD535] text-black font-bold text-lg rounded-xl hover:bg-yellow-400 inline-flex items-center gap-2"
        >
          Get Started Now <ArrowRight size={22} />
        </button>
      </section>
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
