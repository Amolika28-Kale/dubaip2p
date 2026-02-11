import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Shield, Zap, Globe, TrendingUp, Users, Star,
  CheckCircle, Clock, Wallet, ChevronLeft, ChevronRight
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { getExchangeRate } from '../services/exchangeService'
import LatestExchangesTicker from '../components/LatestExchangesTicker'
import { getReviews } from '../services/reviewService'

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AuthContext)

  const [rate, setRate] = useState(82.5)
  const [fiatAmount, setFiatAmount] = useState(1000)
  const [reviews, setReviews] = useState([])
  
  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const d = await getExchangeRate()
        setRate(d.rate || 82.5)
      } catch (e) { console.error(e) }
    }

    const fetchReviews = async () => {
      try {
        const d = await getReviews()
        setReviews(d.reviews || [])
      } catch (e) { console.error(e) }
    }

    fetchRate()
    fetchReviews()
  }, [])

  // Auto-play Carousel Logic
  useEffect(() => {
    if (reviews.length > 0) {
      const timer = setInterval(() => {
        nextSlide()
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [currentIndex, reviews])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(reviews.length / (window.innerWidth < 768 ? 1 : 3)))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.ceil(reviews.length / (window.innerWidth < 768 ? 1 : 3)) - 1 : prev - 1))
  }

  const cryptoAmount = (fiatAmount / rate).toFixed(4)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-x-hidden">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(252,213,53,0.15),_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 relative z-10">

          {/* LEFT */}
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tighter">
              <span className="text-[#FCD535]">DubaiP2P</span>
              <br />
              Secure INR → USDT Exchange
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto md:mx-0">
              Trusted peer-to-peer crypto exchange with instant settlement,
              escrow protection and real-time rates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-10">
              <button
                onClick={() => navigate(isAuthenticated ? '/exchange' : '/signup')}
                className="px-8 py-4 bg-[#FCD535] text-black font-bold rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Start Trading <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 border border-[#FCD535] text-[#FCD535] font-bold rounded-xl hover:bg-[#FCD535] hover:text-black transition w-full sm:w-auto"
              >
                Sign In
              </button>
            </div>

            {/* TRUST STRIP */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-xs md:text-sm text-gray-400">
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
          <div className="bg-zinc-900/80 border border-[#FCD535]/30 rounded-3xl p-6 md:p-8 backdrop-blur order-1 md:order-2">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-center md:text-left">Live Exchange Calculator</h3>

            <div className="text-center bg-black/50 p-4 md:p-6 rounded-xl mb-6 border border-zinc-800">
              <p className="text-xs md:text-sm text-gray-400 mb-2 font-bold uppercase tracking-widest">Current Rate</p>
              <p className="text-3xl md:text-4xl font-black text-[#FCD535]">
                ₹{rate.toFixed(2)}
              </p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Per 1 USDT</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs md:text-sm text-gray-400 font-bold uppercase ml-1">You Send (INR)</label>
                <input
                  type="number"
                  value={fiatAmount}
                  onChange={e => setFiatAmount(+e.target.value || 0)}
                  className="w-full mt-1 p-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:border-[#FCD535] outline-none transition-colors font-bold text-lg"
                />
              </div>
              <div>
                <label className="text-xs md:text-sm text-gray-400 font-bold uppercase ml-1">You Receive (USDT)</label>
                <input
                  value={cryptoAmount}
                  readOnly
                  className="w-full mt-1 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl opacity-70 font-bold text-lg text-yellow-500"
                />
              </div>
            </div>

            <button
              onClick={() => navigate(isAuthenticated ? '/exchange' : '/login')}
              className="w-full mt-6 py-4 bg-[#FCD535] text-black font-black rounded-xl hover:bg-yellow-400 active:scale-95 transition-all shadow-lg shadow-yellow-500/10 uppercase tracking-widest text-xs"
            >
              {isAuthenticated ? 'Proceed to Exchange' : 'Login to Trade'}
            </button>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          ['2,800+', 'Active Users'],
          ['12,500+', 'Trades Completed'],
          ['₹4.2 Cr', '24h Volume'],
          ['99.3%', 'Success Rate']
        ].map(([value, label]) => (
          <div key={label} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 md:p-6 text-center hover:border-zinc-700 transition-colors">
            <p className="text-xl md:text-3xl font-black text-[#FCD535] tracking-tighter">{value}</p>
            <p className="text-[10px] md:text-xs text-gray-500 mt-1 font-bold uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </section>

      {/* ================= WHY TRUST ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-10 md:text-left md:mb-16 uppercase italic tracking-tighter">
          Why Traders Trust DubaiP2P
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 md:p-8 rounded-[2rem] hover:border-[#FCD535]/50 transition-all group">
              <div className="p-3 bg-yellow-500/5 w-fit rounded-2xl mb-4 group-hover:bg-yellow-500/10 transition-colors">
                <f.icon className="text-[#FCD535]" size={32} />
              </div>
              <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LIVE WIDGETS ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20">
        <LatestExchangesTicker />
      </section>

{/* ================= REVIEWS CAROUSEL ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">Trusted by Real Traders</h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Verified Feedback from our community</p>
            </div>
            
            {/* Carousel Controls */}
            <div className="flex gap-2 mt-6 md:mt-0">
                <button onClick={prevSlide} className="p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-yellow-500 text-white transition-all active:scale-90">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={nextSlide} className="p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-yellow-500 text-white transition-all active:scale-90">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center py-10 opacity-30">
             <Star size={40} />
             <p className="mt-2 font-bold uppercase text-xs">No reviews to display</p>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out gap-6"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="min-w-full md:min-w-[calc(33.333%-16px)] bg-[#161A1E] border border-zinc-800 p-6 md:p-8 rounded-[2rem] flex flex-col justify-between transition-all hover:border-yellow-500/30"
                >
                  <div>
                    <div className="flex mb-4 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < (r.rating || 5) ? "fill-[#FCD535] text-[#FCD535]" : "text-zinc-700"} />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-8 text-sm italic font-medium leading-relaxed">"{r.text}"</p>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-zinc-800/50">
                    <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-xs font-black text-yellow-500 uppercase border border-yellow-500/20">
                      {r.username?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tighter">{r.username}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      {/* ================= FINAL CTA ================= */}
      <section className="text-center py-20 md:py-28 bg-gradient-to-r from-[#FCD535]/5 to-transparent px-4">
        <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter italic">
          Start Your First Trade in 2 Minutes
        </h2>
        <p className="text-lg md:text-xl text-gray-500 mb-10 font-bold uppercase tracking-widest">
          No fees • Instant settlement • 100% secure
        </p>
        <button
          onClick={() => navigate(isAuthenticated ? '/exchange' : '/signup')}
          className="px-10 md:px-16 py-4 md:py-5 bg-[#FCD535] text-black font-black text-sm md:text-lg rounded-2xl hover:bg-yellow-400 inline-flex items-center justify-center gap-2 active:scale-95 transition-all shadow-2xl shadow-yellow-500/20"
        >
          GET STARTED NOW <ArrowRight size={22} />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 md:py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div>
              <h4 className="font-black text-[#FCD535] mb-6 uppercase tracking-widest text-xs">DubaiP2P</h4>
              <ul className="space-y-3 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                <li><a href="#" className="hover:text-[#FCD535] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#FCD535] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#FCD535] transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[#FCD535] mb-6 uppercase tracking-widest text-xs">Products</h4>
              <ul className="space-y-3 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                <li><a href="#" className="hover:text-[#FCD535] transition-colors">P2P Exchange</a></li>
                <li><a href="#" className="hover:text-[#FCD535] transition-colors">API</a></li>
                <li><a href="#" className="hover:text-[#FCD535] transition-colors">Rates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[#FCD535] mb-6 uppercase tracking-widest text-xs">Support</h4>
              <ul className="space-y-3 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                <li><a href="#" className="hover:text-[#FCD535] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[#FCD535] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#FCD535] transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[#FCD535] mb-6 uppercase tracking-widest text-xs">Legal</h4>
              <ul className="space-y-3 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                <li><a href="#" className="hover:text-[#FCD535] transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-[#FCD535] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[#FCD535] transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-900 pt-8 text-center text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <p>&copy; 2026 DubaiP2P. All rights reserved. | Secure P2P Exchange Platform</p>
          </div>
        </div>
      </footer>
    </div>
  )
}