import React, { useEffect, useState, useContext } from 'react'
import { Shield, X, Users, Star, History, ArrowDownCircle, ArrowUpCircle, Search, Copy, CheckCircle2 } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  getAdminTrades,
  getExchangeRate,
  getOperatorStatus,
  toggleOperatorStatus,
  updateExchangeRate,
  releaseTrade,
  rejectTrade,
  getAllUsers,
} from '../services/adminService'
import { getReviews } from '../services/reviewService'

export default function AdminDashboard() {
  const { token, isAdmin, loading } = useContext(AuthContext)

  const [trades, setTrades] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [selected, setSelected] = useState(null)
  const [txid, setTxid] = useState('')
  const [rate, setRate] = useState('')
  const [rateEdit, setRateEdit] = useState(false)
  const [operator, setOperator] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('trades')
  
  const [userSearch, setUserSearch] = useState('')
  const [tradeFilter, setTradeFilter] = useState('ALL')

  useEffect(() => {
    if (!token) return
    fetchTrades(); fetchRate(); fetchOperator(); fetchUsers(); fetchReviews()
  }, [token])

  const fetchTrades = async () => {
    try { const d = await getAdminTrades(token); setTrades(d.trades || []) } catch (e) { console.error(e) }
  }

  const fetchUsers = async () => {
    try { const d = await getAllUsers(token); setUsers(d.users || []) } catch (e) { console.error(e) }
  }

  const fetchReviews = async () => {
    try { const d = await getReviews(token); setReviews(d.reviews || []) } catch (e) { console.error(e) }
  }

  const fetchRate = async () => {
    try { const d = await getExchangeRate(); setRate(d.rate) } catch (e) { console.error(e) }
  }

  const toggleOperator = async () => {
    try {
      const d = await toggleOperatorStatus(token, operator)
      setOperator(!!d.online)
      toast.success(`System is now ${d.online ? 'Online' : 'Offline'}`)
    } catch (e) { console.error(e) }
  }

  const fetchOperator = async () => {
    try { const d = await getOperatorStatus(token); setOperator(!!d.online) } catch (e) { console.error(e) }
  }

  const releaseAssets = async (tradeId) => {
    if (!txid) return toast.error('TXID/Hash required');
    setActionLoading(true);
    try {
      const d = await releaseTrade(token, tradeId, txid);
      if (d.trade) { 
        toast.success('Trade released successfully');
        setSelected(null); setTxid(''); fetchTrades(); 
      }
    } catch (e) { toast.error('Failed to release'); }
    setActionLoading(false);
  }

  const rejectTradeHandler = async (tradeId) => {
    const reason = window.prompt('Reason for rejection?');
    if (reason === null) return;
    setActionLoading(true);
    try {
      await rejectTrade(token, tradeId, reason);
      toast.success('Trade rejected');
      setSelected(null); fetchTrades();
    } catch (e) { toast.error('Failed to reject'); }
    setActionLoading(false);
  }

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  }

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.username?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredTrades = trades.filter(t => 
    tradeFilter === 'ALL' ? true : t.type === tradeFilter
  );

  if (loading) return <div className="text-gray-400 text-center py-10">Syncing Admin Data...</div>
  if (!isAdmin) return <div className="text-red-400 text-center py-10 font-bold uppercase tracking-widest">Restricted Access</div>

  return (
    <div className="space-y-6 p-2 md:p-4 max-w-7xl mx-auto pb-20">
      
      {/* HEADER SECTION - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-[#161A1E] p-4 md:p-6 rounded-2xl border border-zinc-800 shadow-xl">
          <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Market Control</h3>
          <div className="flex flex-wrap gap-3 items-center justify-between md:justify-start">
            <div className="text-xl md:text-2xl font-black text-white">₹{rate} <span className="text-[10px] text-gray-500">/ USDT</span></div>
            <div className="flex gap-2">
                <button 
                onClick={toggleOperator} 
                className={`px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase transition-all border ${operator ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                >
                {operator ? 'Online' : 'Offline'}
                </button>
                <button onClick={() => setRateEdit(!rateEdit)} className="bg-[#FCD535] text-black px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase hover:bg-yellow-400">Edit</button>
            </div>
          </div>
          {rateEdit && (
            <div className="mt-4 flex gap-2 animate-in slide-in-from-top-2">
              <input value={rate} onChange={(e) => setRate(e.target.value)} className="bg-black border border-zinc-700 px-3 py-1.5 rounded-xl w-24 text-white text-sm outline-none focus:border-[#FCD535]" />
              <button onClick={async () => { await updateExchangeRate(token, rate); setRateEdit(false); }} className="bg-green-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase">Save</button>
            </div>
          )}
        </div>

        <div className="bg-[#161A1E] p-4 md:p-6 rounded-2xl border border-zinc-800 shadow-xl flex justify-around items-center">
          <div className="text-center">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Users</p>
            <p className="text-xl md:text-2xl font-black text-[#FCD535]">{users.length}</p>
          </div>
          <div className="h-8 w-[1px] bg-zinc-800"></div>
          <div className="text-center">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Alerts</p>
            <p className="text-xl md:text-2xl font-black text-red-500">{trades.filter(t => t.status === 'PAID').length}</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS - Sticky on mobile */}
      <div className="sticky top-[60px] bg-[#0B0E11] z-30 flex border-b border-zinc-800 gap-4 md:gap-6 overflow-x-auto no-scrollbar pt-2">
        {['trades', 'users', 'reviews'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            className={`pb-3 px-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'text-[#FCD535] border-b-2 border-[#FCD535]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: TRADES */}
      {activeTab === 'trades' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#161A1E] p-3 rounded-xl border border-zinc-800 gap-3">
             <div className="flex gap-1">
                {['ALL', 'BUY', 'SELL'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setTradeFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-colors ${tradeFilter === f ? 'bg-zinc-800 text-white' : 'text-gray-500 hover:bg-zinc-800/50'}`}
                  >
                    {f}
                  </button>
                ))}
             </div>
             <p className="text-[10px] text-gray-500 font-bold uppercase ml-1 sm:ml-0">{filteredTrades.length} Active Orders</p>
          </div>

          <div className="bg-[#161A1E] rounded-2xl border border-zinc-800 overflow-hidden shadow-xl overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-black/20 text-[9px] md:text-[10px] text-zinc-600 font-black uppercase tracking-widest border-b border-zinc-800">
                <tr>
                  <th className="p-4">Type</th>
                  <th className="p-4">Order Info</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredTrades.map(t => (
                    <tr key={t._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className={`flex items-center gap-1.5 text-[9px] font-black ${t.type === 'SELL' ? 'text-red-400' : 'text-green-400'}`}>
                          {t.type === 'SELL' ? <ArrowUpCircle size={12} /> : <ArrowDownCircle size={12} />}
                          {t.type}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-[10px] font-bold text-white leading-none mb-1">#{t._id.slice(-6)}</div>
                        <div className="text-[9px] text-gray-500 truncate max-w-[100px]">{t.user?.email || 'Guest'}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-white font-black text-[11px] md:text-xs">{t.cryptoAmount} USDT</div>
                        <div className="text-gray-500 text-[9px] tracking-tighter">₹{t.fiatAmount?.toLocaleString()}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase border ${t.status === 'PAID' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-zinc-800 text-gray-500 border-zinc-700'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {t.status === 'PAID' && (
                          <button onClick={() => setSelected(t)} className="bg-[#FCD535] text-black px-3 py-1 rounded-lg text-[9px] font-black hover:scale-105 transition-transform active:scale-95">VERIFY</button>
                        )}
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: USERS - Responsive Card Layout */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="relative max-w-full md:max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
             <input 
              type="text" 
              placeholder="Search customers..." 
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-[#161A1E] border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-[#FCD535]"
             />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredUsers.map(u => (
              <div key={u._id} className="bg-[#161A1E] p-4 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all group">
                <div className="flex justify-between items-start mb-3">
                   <div className="h-7 w-7 bg-zinc-800 rounded-lg flex items-center justify-center text-yellow-400 text-xs font-bold uppercase">{u.email?.[0] || 'U'}</div>
                   <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${u.isAdmin ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>{u.isAdmin ? 'ADMIN' : 'USER'}</span>
                </div>
                <div className="font-bold text-xs text-white truncate mb-1">{u.email}</div>
                <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-3">Balance: <span className="text-yellow-400">₹{u.balance || 0}</span></div>
                <div className="flex justify-between items-center pt-3 border-t border-zinc-800/50">
                    <span className="text-[8px] text-gray-600">ID: {u._id.slice(-8)}</span>
                    <button onClick={() => copyText(u.email)} className="text-gray-500 group-hover:text-yellow-400 p-1"><Copy size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 animate-in fade-in duration-500">
          {reviews.length === 0 ? <p className="text-gray-500 text-xs italic p-4">No feedback received yet.</p> : reviews.map(r => (
            <div key={r._id} className="bg-[#161A1E] p-4 md:p-5 rounded-2xl border border-zinc-800 shadow-lg">
              <div className="flex gap-1 text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={8} fill={i < (r.rating || 0) ? "currentColor" : "none"} />)}
              </div>
              <p className="text-xs italic text-gray-300 mb-4 font-medium leading-relaxed">"{r.text}"</p>
              <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-zinc-800 rounded-md flex items-center justify-center text-[9px] font-bold text-gray-500 uppercase">{r.username?.[0] || 'A'}</div>
                  <div className="text-[9px] text-zinc-500 font-black uppercase tracking-tighter">— {r.username || 'Anonymous'}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VERIFICATION MODAL - Mobile Optimized Overlay */}
      {selected && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[100] p-2 md:p-4 overflow-y-auto">
          <div className="bg-[#0B0E11] border border-[#FCD535]/20 p-4 md:p-6 rounded-[2rem] w-full max-w-2xl max-h-[98vh] overflow-y-auto shadow-2xl relative">
            
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#0B0E11] py-2 z-10">
              <h3 className="text-white font-black uppercase tracking-tighter text-sm md:text-lg flex items-center gap-2">
                <CheckCircle2 className="text-[#FCD535]" size={18} /> {selected.type} Processing
              </h3>
              <button onClick={() => setSelected(null)} className="bg-zinc-900 p-2 rounded-full text-gray-500 hover:text-white transition"><X size={18}/></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                <h4 className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-3">Payout Details</h4>
                <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800 mb-3 flex items-center justify-between">
                    <code className="text-[10px] text-yellow-500 truncate mr-2 font-mono">{selected.walletAddress}</code>
                    <button onClick={() => copyText(selected.walletAddress)} className="text-white hover:text-[#FCD535] p-1"><Copy size={12} /></button>
                </div>
                <p className="text-[9px] text-zinc-500 uppercase font-bold truncate">Email: {selected.user?.email}</p>
              </div>

              <div className={`p-4 rounded-2xl border ${selected.type === 'SELL' ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                <h4 className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-3">
                  {selected.type === 'SELL' ? 'Pay INR' : 'Release USDT'}
                </h4>
                <p className="text-xl md:text-2xl font-black text-white leading-tight mb-1">
                  {selected.type === 'SELL' ? `₹${selected.fiatAmount.toLocaleString()}` : `${selected.cryptoAmount} USDT`}
                </p>
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">Market Rate: ₹{selected.rate}</p>
              </div>
            </div>

            {/* Proof of Payment - Clickable for details */}
            {selected.transactionScreenshot && (
              <div className="mb-6">
                <h4 className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-2">User Receipt</h4>
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-1.5 overflow-hidden">
                   <img 
                    src={`https://dubaip2p.onrender.com${selected.transactionScreenshot}`} 
                    alt="Proof" 
                    className="w-full max-h-60 md:max-h-96 object-contain rounded-xl cursor-zoom-in"
                    onClick={() => window.open(`https://dubaip2p.onrender.com${selected.transactionScreenshot}`)}
                   />
                </div>
                <p className="text-center text-[8px] text-zinc-600 mt-2 font-bold uppercase italic">Tap image to verify transfer ID</p>
              </div>
            )}

            {/* Input & Actions */}
            <div className="space-y-4">
              <div className="bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800">
                  <input
                    value={txid}
                    onChange={(e) => setTxid(e.target.value)}
                    placeholder={selected.type === 'SELL' ? "Enter UTR / Bank Ref" : "Enter Blockchain Hash"}
                    className="w-full bg-transparent p-4 text-xs text-white font-mono outline-none"
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  disabled={actionLoading}
                  onClick={() => releaseAssets(selected._id)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-[10px]"
                >
                  {actionLoading ? 'Processing...' : 'Approve & Close Order'}
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => rejectTradeHandler(selected._id)}
                  className="w-full bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white py-4 rounded-2xl font-black border border-red-500/20 transition-all text-[10px] uppercase tracking-widest"
                >
                  Reject Trade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}