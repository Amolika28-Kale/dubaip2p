import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Shield, Zap, Globe, TrendingUp, Users, Star,
  CheckCircle, Clock, Wallet, ChevronLeft, ChevronRight, Lock, 
  BarChart3, Download, ChevronDown, Menu, X
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { getExchangeRate } from '../services/exchangeService'
import LatestExchangesTicker from '../components/LatestExchangesTicker'
import { getReviews } from '../services/reviewService'

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AuthContext)

  const [rate, setRate] = useState(89.42)
  const [fiatAmount, setFiatAmount] = useState(100)
  const [reviews, setReviews] = useState([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [tradeType, setTradeType] = useState('buy') // 'buy' or 'sell'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rateData, reviewData] = await Promise.all([
          getExchangeRate(),
          getReviews()
        ])
        setRate(rateData.rate || 89.42)
        setReviews(reviewData.reviews || [])
      } catch (e) { console.error(e) }
    }
    fetchData()
  }, [])

  const cryptoAmount = (fiatAmount / rate).toFixed(4)

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      
      {/* ================= HEADER / NAVBAR ================= */}
      <nav className="border-b border-gray-200 px-4 md:px-8 py-3 flex justify-between items-center bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-6">
          {/* LOGO */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-200">D</div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tighter">DubaiP2P</h2>
          </div>
        </div>

        {/* RIGHT SIDE TOOLS */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button onClick={() => navigate('/login')} className="text-[13px] font-bold px-3 py-1.5 text-gray-600 hover:text-blue-600 transition-colors">Log In</button>
            <button onClick={() => navigate('/signup')} className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md text-[13px] font-bold text-white transition-all shadow-md shadow-blue-200">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-blue-600 text-xs font-bold mb-6">
            <Zap size={14} fill="currentColor" /> #1 Trusted P2P Platform in UAE & India
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight text-gray-900">
            Seamlessly Exchange <br />
            <span className="text-blue-600 italic">INR to USDT</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-lg leading-relaxed">
            Experience institutional-grade security with 0% fees. Join thousands of users trading on the most reliable escrow-protected network.
          </p>
          
          <div className="flex items-center gap-8 mb-10">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">₹0</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Hidden Fees</span>
            </div>
            
            <div className="h-8 w-[1px] bg-gray-300"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">24/7</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Expert Support</span>
            </div>
          </div>
        </div>

        {/* EXCHANGE WIDGET */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xl shadow-gray-200/50 relative">
          <div className="flex gap-4 p-1 bg-gray-100 rounded-2xl mb-8">
            <button 
              onClick={() => setTradeType('buy')}
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${tradeType === 'buy' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Buy
            </button>
            <button 
              onClick={() => setTradeType('sell')}
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${tradeType === 'sell' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Sell
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <div className="flex justify-between mb-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  {tradeType === 'buy' ? 'You Spend' : 'You Sell'}
                </label>
              </div>
              <div className="flex justify-between items-center">
                <input 
                  type="number" 
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(+e.target.value)}
                  className="bg-transparent text-3xl font-black outline-none w-full tracking-tighter text-gray-900"
                />
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
                  <div className={`w-5 h-5 ${tradeType === 'buy' ? 'bg-orange-500' : 'bg-green-500'} rounded-full flex items-center justify-center text-[10px] font-black text-white`}>
                    {tradeType === 'buy' ? '₹' : 'T'}
                  </div>
                  <span className="font-bold text-sm tracking-tight text-gray-900">{tradeType === 'buy' ? 'INR' : 'USDT'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">
                Approx. Receive
              </label>
              <div className="flex justify-between items-center">
                <input 
                  readOnly 
                  value={cryptoAmount}
                  className={`bg-transparent text-3xl font-black outline-none w-full tracking-tighter ${tradeType === 'buy' ? 'text-green-600' : 'text-blue-600'}`}
                />
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
                  <div className={`w-5 h-5 ${tradeType === 'buy' ? 'bg-green-500' : 'bg-orange-500'} rounded-full flex items-center justify-center text-[10px] font-black text-white`}>
                    {tradeType === 'buy' ? 'T' : '₹'}
                  </div>
                  <span className="font-bold text-sm tracking-tight text-gray-900">{tradeType === 'buy' ? 'USDT' : 'INR'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-[11px] px-2 text-gray-500 font-bold uppercase tracking-wider">
              <span>Reference Rate</span>
              <span className="text-gray-900">1 USDT ≈ ₹{tradeType === 'buy' ? rate.toFixed(2) : (rate - 0.5).toFixed(2)}</span>
            </div>

            <button 
              onClick={() => navigate(isAuthenticated ? '/exchange' : '/signup')}
              className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
            >
              {tradeType === 'buy' ? 'Buy USDT' : 'Sell USDT'}
            </button>
          </div>
        </div>
      </section>

      {/* ================= TRADE EDUCATION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Buy Side */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-[2.5rem] border border-blue-200">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
              <TrendingUp className="text-white" size={24} />
            </div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-gray-900">Buying USDT</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">Perfect for investors looking to enter the crypto market. Convert your local INR into digital dollars (USDT) instantly via UPI or Bank Transfer.</p>
            
            <div className="space-y-4">
              {[
                { step: "01", text: "Enter INR amount and choose payment method." },
                { step: "02", text: "Pay the Merchant using the secure details provided." },
                { step: "03", text: "Upload your receipt and receive USDT in your wallet." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-blue-600 font-black text-xl italic">{item.step}</span>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sell Side */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-[2.5rem] border border-blue-200">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
              <Download className="text-white" size={24} />
            </div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-gray-900">Selling USDT</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">Need instant liquidity? Liquidate your USDT holdings and get INR directly into your Bank Account or UPI ID within minutes.</p>
            
            <div className="space-y-4">
              {[
                { step: "01", text: "Deposit USDT into our secure Virtual Escrow." },
                { step: "02", text: "System verifies the blockchain transaction." },
                { step: "03", text: "INR is released to your bank account immediately." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-blue-600 font-black text-xl italic">{item.step}</span>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= TICKER SECTION ================= */}
      <div className="bg-gray-50 py-4 border-y border-gray-200">
        <LatestExchangesTicker />
      </div>

      {/* ================= COMPATIBILITY STRIP ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 opacity-70 hover:opacity-100 transition-all duration-500">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Supported Networks</span>
            <div className="flex gap-6 items-center">
              <span className="font-black text-xl tracking-tighter text-gray-900">TRC-20</span>
              <span className="font-black text-xl tracking-tighter text-gray-900">BEP-20</span>
            </div>
          </div>
          <div className="h-12 w-[1px] bg-gray-300 hidden md:block"></div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Instant Payouts To</span>
            <div className="flex gap-6 items-center flex-wrap justify-center">
              <span className="font-bold text-sm text-gray-700">UPI (PhonePe/GPay)</span>
              <span className="font-bold text-sm text-gray-700">HDFC Bank</span>
              <span className="font-bold text-sm text-gray-700">ICICI Bank</span>
              <span className="font-bold text-sm text-gray-700">SBI</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECURITY & FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight uppercase italic tracking-tighter text-gray-900">
              World-Class Security <br /> For Every Transaction
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600 h-fit">
                   <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Bank-Grade Escrow</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Your digital assets are safely held in our cold-storage escrow during the transaction, released only when both parties are satisfied.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600 h-fit">
                   <Lock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Identity Verification</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Our advanced KYC/AML protocols ensure that you trade with verified individuals, drastically reducing risk.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600 h-fit">
                   <CheckCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">100% Reserve Proof</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">We maintain a 1:1 reserve for all user assets, audited regularly for maximum transparency and trust.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                <Users className="text-blue-600 mb-3" size={30} />
                <span className="text-2xl font-bold text-gray-900">12k+</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold mt-1">Active Users</span>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center translate-y-8">
                <BarChart3 className="text-blue-600 mb-3" size={30} />
                <span className="text-2xl font-bold text-gray-900">₹42Cr</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold mt-1">24h Volume</span>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                <Clock className="text-blue-600 mb-3" size={30} />
                <span className="text-2xl font-bold text-gray-900">~2.8m</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold mt-1">Avg. Release</span>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center translate-y-8">
                <Star className="text-blue-600 mb-3" size={30} fill="currentColor" />
                <span className="text-2xl font-bold text-gray-900">4.9/5</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold mt-1">User Rating</span>
             </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-gray-900">Common Questions</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Everything you need to know about DubaiP2P</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How long does a typical trade take?",
              a: "Buying USDT usually takes 3-5 minutes after you upload your receipt. Selling USDT is even faster; once the blockchain confirms your deposit (usually 2 minutes), INR is released to your UPI/Bank account instantly."
            },
            {
              q: "Is there a limit on how much I can trade?",
              a: "For new users, the daily limit is ₹50,000. Verified merchants and high-volume traders can request limits up to ₹50 Lakhs per day through the 'Master Settings' in their profile."
            },
            {
              q: "What happens if a merchant doesn't release my assets?",
              a: "Our Bank-Grade Escrow system holds the assets. If a dispute arises, our 24/7 support team reviews the uploaded payment proof. If the proof is valid, the assets are released to you manually by an administrator."
            },
            {
              q: "Which networks are supported for USDT?",
              a: "We primarily support TRC-20 (Tron) and BEP-20 (Binance Smart Chain) due to their low gas fees. Please ensure you select the correct network in your wallet before sending."
            },
            {
              q: "Are there any hidden fees?",
              a: "None. The rate you see in the 'Live Calculator' is the rate you get. We earn through the small spread between buy and sell orders, ensuring 0% direct transaction fees for our users."
            }
          ].map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>

      {/* ================= REVIEWS SECTION ================= */}
      <section className="bg-gray-50 py-24 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase text-gray-900">Merchant Feedback</h2>
              <p className="text-gray-500 text-xs font-bold uppercase mt-2 tracking-widest">Real voices from our trading community</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:border-blue-400 transition-all bg-white"><ChevronLeft size={20} className="text-gray-600"/></button>
              <button className="p-2 border border-gray-200 rounded-lg hover:border-blue-400 transition-all bg-white"><ChevronRight size={20} className="text-gray-600"/></button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((rev, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                <div className="flex gap-1 mb-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-sm text-gray-700 italic mb-6">"{rev.text || "Extremely fast release and very professional service. Best rates for INR to USDT exchange."}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xs uppercase text-white">{rev.username?.[0] || 'U'}</div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-900">{rev.username || 'Verified User'}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Trusted Merchant</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRADING SAFETY TIPS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-blue-50/50 border border-blue-200 rounded-[3rem] p-8 md:p-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/3">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-4 text-gray-900">Trade Like <br /> A Pro.</h2>
              <p className="text-gray-600 text-sm font-bold uppercase tracking-widest">Follow these rules for 100% security.</p>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "Off-Platform Policy", text: "Never agree to trade outside the DubaiP2P platform. Our escrow only protects you on-site." },
                { title: "Verification Check", text: "Always verify the payment has cleared in your bank app before releasing assets." },
                { title: "Network Match", text: "Ensure your USDT network (TRC20/BEP20) matches the wallet address to avoid loss of funds." },
                { title: "Receipt Integrity", text: "Upload original payment screenshots. Cropped or edited images will delay your trade." }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 font-black text-xs">{i+1}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{tip.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-200/20 blur-[120px] rounded-full"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase italic tracking-tight leading-tight text-gray-900">
            The Future of P2P <br /> Is Just One Click Away
          </h2>
          <p className="text-gray-600 mb-10 text-lg font-medium">No registrations fees, no hidden spreads. Just clean and fast trading.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/signup')} className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl font-black text-lg text-white transition-all shadow-xl shadow-blue-200">
              OPEN FREE ACCOUNT
            </button>
          
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-200 pt-20 pb-10 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-black text-white text-[10px]">D</div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tighter uppercase italic">DubaiP2P</h2>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">World's most secure peer-to-peer digital asset exchange platform with instant INR settlement.</p>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-4">© 2026 DubaiP2P Exchange Ltd. | Secure Peer-to-Peer Trading</p>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-4">
              <Shield size={12} className="text-green-600" /> SYSTEM STATUS: <span className="text-green-600">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200 bg-white'}`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-bold text-sm md:text-base uppercase tracking-tight text-gray-900">{question}</span>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-6 px-6' : 'max-h-0'}`}
      >
        <p className="text-sm text-gray-600 leading-relaxed font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
}