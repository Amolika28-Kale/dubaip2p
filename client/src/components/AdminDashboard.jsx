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

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-blue-600 font-black animate-pulse uppercase tracking-widest">Initialising Terminal...</div>

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-24">
      
      {/* ================= TOP STATS BAR ================= */}
      <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* USDT Balance Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Wallet size={60} className="text-gray-900" /></div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2">Total System Volume</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black tracking-tighter text-gray-900">1,24,500.00</h2>
            <span className="text-sm font-bold text-gray-500 tracking-tighter">USDT</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-black uppercase">≈ ₹1.10 Cr Locked in Escrow</p>
        </div>

        {/* Staking / Active Users Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Users size={60} className="text-gray-900" /></div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2">Merchant Nodes</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black tracking-tighter text-gray-900">{users.length}</h2>
            <span className="text-sm font-bold text-blue-600">Active</span>
          </div>
          <button className="text-[10px] text-blue-600 mt-2 font-black uppercase hover:underline">View All Merchants →</button>
        </div>

        {/* Live Rate Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={60} className="text-gray-900" /></div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2">USDT/INR Market Rate</p>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black tracking-tighter text-green-600">₹{rate}</h2>
            <button onClick={() => setRateEdit(true)} className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-gray-100 transition-all">
               <Settings size={18} className="text-gray-600" />
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
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-bold tracking-tighter italic text-gray-900">Pending Operations</h3>
            <div className="flex gap-2">
               <button onClick={fetchTrades} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><RefreshCcw size={16} className="text-gray-600"/></button>
               <button className="text-[10px] bg-blue-600 px-3 py-1.5 rounded-lg font-black uppercase tracking-tighter text-white shadow-sm shadow-blue-200">History</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Trade ID / Type</th>
                  <th className="px-6 py-4">Merchant Node</th>
                  <th className="px-6 py-4">Fiat Amount</th>
                  <th className="px-6 py-4">Asset Volume</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trades.filter(t => t.status === 'PAID').map((t) => (
                  <tr key={t._id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic text-xs ${t.type === 'SELL' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {t.type === 'SELL' ? 'S' : 'B'}
                        </div>
                        <div>
                          <p className="text-xs font-black tracking-widest text-gray-900 uppercase">#{t._id.slice(-6)}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">{new Date(t.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-gray-700">{t.user?.username || 'Unknown'}</p>
                      <p className="text-[10px] text-gray-500">{t.user?.email}</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-gray-900 italic tracking-tighter">₹{t.fiatAmount?.toLocaleString()}</td>
                    <td className="px-6 py-5">
                       <span className="text-xs font-black text-blue-600">{t.cryptoAmount} USDT</span>
                    </td>
                    <td className="px-6 py-5">
                       <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded text-[9px] font-black border border-blue-200 uppercase">PAID</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button 
                        onClick={() => setSelected(t)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter text-white shadow-sm shadow-blue-200 active:scale-95 transition-all"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 p-8 rounded-3xl w-full max-w-sm shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Activity className="text-blue-600" size={20} /> Update Market Rate
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                 <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">New USDT Price (INR)</label>
                 <input 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setRate(e.target.value)}
                  className="bg-transparent text-3xl font-black w-full outline-none text-blue-600"
                  placeholder="89.50"
                 />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setRateEdit(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-xs uppercase text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
                <button 
                  onClick={async () => { await updateExchangeRate(token, rate); setRateEdit(false); toast.success('Rate Updated') }} 
                  className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-xs uppercase text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= BOTTOM MOBILE NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 md:hidden flex justify-between items-center z-[150] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('trades')} className={`flex flex-col items-center gap-1 ${activeTab === 'trades' ? 'text-blue-600' : 'text-gray-400'}`}>
          <BarChart3 size={20} />
          <span className="text-[9px] font-black uppercase">Trades</span>
        </button>
        <button onClick={() => setActiveTab('users')} className={`flex flex-col items-center gap-1 ${activeTab === 'users' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Users size={20} />
          <span className="text-[9px] font-black uppercase">Users</span>
        </button>
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center -translate-y-6 border-4 border-white shadow-lg shadow-blue-200 active:scale-90 transition-transform">
           <Zap size={24} fill="white" className="text-white" />
        </div>
        <button onClick={() => setActiveTab('reviews')} className={`flex flex-col items-center gap-1 ${activeTab === 'reviews' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Star size={20} />
          <span className="text-[9px] font-black uppercase">Reviews</span>
        </button>
        <button onClick={toggleOperatorStatus} className={`flex flex-col items-center gap-1 ${operator ? 'text-green-600' : 'text-red-500'}`}>
          <Shield size={20} />
          <span className="text-[9px] font-black uppercase">Status</span>
        </button>
      </div>

    </div>
  )
}