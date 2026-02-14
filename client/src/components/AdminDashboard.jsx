import React, { useEffect, useState, useContext } from 'react'
import { 
  Shield, X, Users, Star, History, ArrowDownCircle, ArrowUpCircle, 
  Search, Copy, CheckCircle2, Activity, Settings, BarChart3, 
  Wallet, TrendingUp, RefreshCcw, MoreVertical, Ban,
  Zap
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  getAdminTrades, getExchangeRate, getOperatorStatus,
  toggleOperatorStatus, updateExchangeRate, releaseTrade,
  rejectTrade, getAllUsers,
} from '../services/adminService'
import { getReviews } from '../services/reviewService'

export default function AdminDashboard() {
  const { token, isAdmin, loading } = useContext(AuthContext)

  // States
  const [trades, setTrades] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [selected, setSelected] = useState(null)
  const [txid, setTxid] = useState('')
  const [rate, setRate] = useState('89.42')
  const [rateEdit, setRateEdit] = useState(false)
  const [operator, setOperator] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('trades')
  const [userSearch, setUserSearch] = useState('')

  useEffect(() => {
    if (!token) return
    const initData = async () => {
      await Promise.all([fetchTrades(), fetchRate(), fetchOperator(), fetchUsers(), fetchReviews()])
    }
    initData()
  }, [token])

  // Logic functions (existing same)
  const fetchTrades = async () => { try { const d = await getAdminTrades(token); setTrades(d.trades || []) } catch (e) {} }
  const fetchUsers = async () => { try { const d = await getAllUsers(token); setUsers(d.users || []) } catch (e) {} }
  const fetchReviews = async () => { try { const d = await getReviews(token); setReviews(d.reviews || []) } catch (e) {} }
  const fetchRate = async () => { try { const d = await getExchangeRate(); setRate(d.rate) } catch (e) {} }
  const fetchOperator = async () => { try { const d = await getOperatorStatus(token); setOperator(!!d.online) } catch (e) {} }

  if (loading) return <div className="min-h-screen bg-[#0b0e11] flex items-center justify-center text-blue-500 font-black animate-pulse uppercase tracking-widest">Initialising Terminal...</div>

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white font-sans pb-24">
      
      {/* ================= TOP STATS BAR (TRANSACTIFY STYLE) ================= */}
      <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* USDT Balance Card */}
        <div className="bg-[#181a20] p-6 rounded-2xl border border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Wallet size={60} /></div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2">Total System Volume</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black tracking-tighter">1,24,500.00</h2>
            <span className="text-sm font-bold text-gray-400 tracking-tighter">USDT</span>
          </div>
          <p className="text-[10px] text-gray-600 mt-2 font-black uppercase">≈ ₹1.10 Cr Locked in Escrow</p>
        </div>

        {/* Staking / Active Users Card */}
        <div className="bg-[#181a20] p-6 rounded-2xl border border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Users size={60} /></div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2">Merchant Nodes</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black tracking-tighter">{users.length}</h2>
            <span className="text-sm font-bold text-blue-500">Active</span>
          </div>
          <button className="text-[10px] text-blue-500 mt-2 font-black uppercase hover:underline">View All Merchants →</button>
        </div>

        {/* Live Rate Card */}
        <div className="bg-[#181a20] p-6 rounded-2xl border border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={60} /></div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2">USDT/INR Market Rate</p>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black tracking-tighter text-green-500">₹{rate}</h2>
            <button onClick={() => setRateEdit(true)} className="p-2 bg-zinc-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-all">
               <Settings size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${operator ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <p className="text-[10px] text-gray-500 font-bold uppercase">{operator ? 'Operator Online' : 'Operator Offline'}</p>
          </div>
        </div>
      </div>

      {/* ================= MARKET PRICES SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-[#181a20] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-xl font-bold tracking-tighter italic">Pending Operations</h3>
            <div className="flex gap-2">
               <button onClick={fetchTrades} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"><RefreshCcw size={16}/></button>
               <button className="text-[10px] bg-blue-600 px-3 py-1.5 rounded-lg font-black uppercase tracking-tighter">History</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0b0e11] text-[10px] font-black uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="px-6 py-4">Trade ID / Type</th>
                  <th className="px-6 py-4">Merchant Node</th>
                  <th className="px-6 py-4">Fiat Amount</th>
                  <th className="px-6 py-4">Asset Volume</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {trades.filter(t => t.status === 'PAID').map((t) => (
                  <tr key={t._id} className="hover:bg-blue-600/[0.02] transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic text-xs ${t.type === 'SELL' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                          {t.type === 'SELL' ? 'S' : 'B'}
                        </div>
                        <div>
                          <p className="text-xs font-black tracking-widest text-white uppercase">#{t._id.slice(-6)}</p>
                          <p className="text-[10px] text-gray-600 font-bold uppercase">{new Date(t.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-gray-300">{t.user?.username || 'Unknown'}</p>
                      <p className="text-[10px] text-gray-600">{t.user?.email}</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-white italic tracking-tighter">₹{t.fiatAmount?.toLocaleString()}</td>
                    <td className="px-6 py-5">
                       <span className="text-xs font-black text-blue-500">{t.cryptoAmount} USDT</span>
                    </td>
                    <td className="px-6 py-5">
                       <span className="bg-blue-600/10 text-blue-500 px-2.5 py-1 rounded text-[9px] font-black border border-blue-500/20 uppercase animate-pulse">PAID</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button 
                        onClick={() => setSelected(t)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-blue-600/10 active:scale-95 transition-all"
                       >
                         Release
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= RATE EDIT MODAL (POPUP) ================= */}
      {rateEdit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#181a20] border border-gray-800 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="text-blue-500" size={20} /> Update Market Rate
            </h3>
            <div className="space-y-4">
              <div className="bg-[#0b0e11] p-4 rounded-xl border border-gray-800">
                 <label className="text-[10px] font-black uppercase text-gray-600 mb-2 block tracking-widest">New USDT Price (INR)</label>
                 <input 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setRate(e.target.value)}
                  className="bg-transparent text-3xl font-black w-full outline-none text-blue-500"
                  placeholder="89.50"
                 />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setRateEdit(false)} className="flex-1 py-3 bg-zinc-800 rounded-xl font-bold text-xs uppercase">Cancel</button>
                <button 
                  onClick={async () => { await updateExchangeRate(token, rate); setRateEdit(false); toast.success('Rate Updated') }} 
                  className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-xs uppercase"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= BOTTOM MOBILE NAV (MEXC STYLE) ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#181a20] border-t border-gray-800 py-3 px-6 md:hidden flex justify-between items-center z-[150] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <button onClick={() => setActiveTab('trades')} className={`flex flex-col items-center gap-1 ${activeTab === 'trades' ? 'text-blue-500' : 'text-gray-600'}`}>
          <BarChart3 size={20} />
          <span className="text-[9px] font-black uppercase">Trades</span>
        </button>
        <button onClick={() => setActiveTab('users')} className={`flex flex-col items-center gap-1 ${activeTab === 'users' ? 'text-blue-500' : 'text-gray-600'}`}>
          <Users size={20} />
          <span className="text-[9px] font-black uppercase">Users</span>
        </button>
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center -translate-y-6 border-4 border-[#0b0e11] shadow-xl shadow-blue-600/30 active:scale-90 transition-transform">
           <Zap size={24} fill="white" className="text-white" />
        </div>
        <button onClick={() => setActiveTab('reviews')} className={`flex flex-col items-center gap-1 ${activeTab === 'reviews' ? 'text-blue-500' : 'text-gray-600'}`}>
          <Star size={20} />
          <span className="text-[9px] font-black uppercase">Reviews</span>
        </button>
        <button onClick={toggleOperatorStatus} className={`flex flex-col items-center gap-1 ${operator ? 'text-green-500' : 'text-red-500'}`}>
          <Shield size={20} />
          <span className="text-[9px] font-black uppercase">Status</span>
        </button>
      </div>

    </div>
  )
}