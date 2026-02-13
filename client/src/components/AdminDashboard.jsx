import React, { useEffect, useState, useContext } from 'react'
import { Shield, X, Users, Star, History, ArrowDownCircle, ArrowUpCircle, Search, Copy, CheckCircle2, Activity, Settings } from 'lucide-react'
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

  if (loading) return <div className="text-gray-400 text-center py-20 font-black uppercase tracking-widest animate-pulse">Syncing encrypted data...</div>
  if (!isAdmin) return <div className="text-red-500 text-center py-20 font-black uppercase tracking-widest">Restricted Access - Terminal Locked</div>

  return (
    <div className="space-y-6 p-2 md:p-4 max-w-7xl mx-auto pb-20 bg-[#0b0e11]">
      
      {/* HEADER SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#181a20] p-6 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={60} className="text-blue-500" />
          </div>
          <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
            <Shield size={12} className="text-blue-500" /> Terminal Control
          </h3>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="text-3xl font-black text-white tracking-tighter">₹{rate} <span className="text-xs text-gray-500 font-bold tracking-normal">/ USDT</span></div>
            <button 
              onClick={toggleOperator} 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${operator ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
            >
              {operator ? '● System Online' : '● System Offline'}
            </button>
            <button onClick={() => setRateEdit(!rateEdit)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">Edit Rate</button>
          </div>
          {rateEdit && (
            <div className="mt-4 flex gap-2 animate-in slide-in-from-top-2">
              <input value={rate} onChange={(e) => setRate(e.target.value)} className="bg-[#0b0e11] border border-gray-700 px-3 py-2 rounded-xl w-24 text-white text-sm font-bold outline-none focus:border-blue-500" />
              <button onClick={async () => { await updateExchangeRate(token, rate); setRateEdit(false); }} className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Save</button>
            </div>
          )}
        </div>

        <div className="bg-[#181a20] p-6 rounded-3xl border border-gray-800 shadow-xl flex justify-around items-center">
          <div className="text-center">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Network Base</p>
            <p className="text-3xl font-black text-blue-500 tracking-tighter">{users.length}</p>
            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-tight">Active Nodes</p>
          </div>
          <div className="h-12 w-[1px] bg-gray-800"></div>
          <div className="text-center">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Queue Alert</p>
            <p className="text-3xl font-black text-red-500 tracking-tighter">{trades.filter(t => t.status === 'PAID').length}</p>
            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-tight">Pending Verif</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-gray-800 gap-6 overflow-x-auto no-scrollbar pt-2">
        {['trades', 'users', 'reviews'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            className={`pb-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500 shadow-[0_4px_20px_-5px_rgba(37,99,235,0.5)]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: TRADES */}
      {activeTab === 'trades' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#181a20] p-4 rounded-2xl border border-gray-800 gap-3">
             <div className="flex gap-2">
                {['ALL', 'BUY', 'SELL'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setTradeFilter(f)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${tradeFilter === f ? 'bg-zinc-800 text-white border border-gray-700' : 'text-gray-500 hover:bg-zinc-800/50'}`}
                  >
                    {f}
                  </button>
                ))}
             </div>
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{filteredTrades.length} Records Locked</p>
          </div>

          <div className="bg-[#181a20] rounded-[2rem] border border-gray-800 overflow-hidden shadow-2xl overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-[#0b0e11] text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] border-b border-gray-800">
                <tr>
                  <th className="p-5 tracking-widest">Type</th>
                  <th className="p-5">Merchant ID</th>
                  <th className="p-5">Asset Volume</th>
                  <th className="p-5">Escrow State</th>
                  <th className="p-5 text-right">Terminal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredTrades.map(t => (
                    <tr key={t._id} className="hover:bg-blue-600/[0.02] transition-colors">
                      <td className="p-5">
                        <div className={`flex items-center gap-1.5 text-[10px] font-black ${t.type === 'SELL' ? 'text-red-500' : 'text-blue-500'}`}>
                          {t.type === 'SELL' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                          {t.type}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="text-[11px] font-black text-white leading-none mb-1 tracking-widest uppercase">#{t._id.slice(-6)}</div>
                        <div className="text-[10px] text-gray-500 truncate max-w-[120px] font-medium italic">{t.user?.email || 'External Node'}</div>
                      </td>
                      <td className="p-5">
                        <div className="text-white font-black text-xs tracking-tighter">{t.cryptoAmount} USDT</div>
                        <div className="text-gray-500 text-[10px] font-bold">₹{t.fiatAmount?.toLocaleString()}</div>
                      </td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border tracking-widest ${t.status === 'PAID' ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 animate-pulse' : 'bg-zinc-800/50 text-gray-500 border-gray-700'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        {t.status === 'PAID' && (
                          <button onClick={() => setSelected(t)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-blue-700 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-blue-600/20">VERIFY</button>
                        )}
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="relative max-w-full md:max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
             <input 
              type="text" 
              placeholder="Filter Merchant Node..." 
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-[#181a20] border border-gray-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white outline-none focus:border-blue-500 transition-all"
             />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map(u => (
              <div key={u._id} className="bg-[#181a20] p-5 rounded-[2rem] border border-gray-800 hover:border-blue-500/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                   <div className="h-9 w-9 bg-[#0b0e11] border border-gray-800 rounded-xl flex items-center justify-center text-blue-500 text-sm font-black italic uppercase shadow-inner">{u.email?.[0] || 'U'}</div>
                   <span className={`text-[8px] font-black px-2.5 py-1 rounded-full border tracking-widest ${u.isAdmin ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>{u.isAdmin ? 'ADMIN' : 'MERCHANT'}</span>
                </div>
                <div className="font-black text-xs text-white truncate mb-1 tracking-tight">{u.email}</div>
                <div className="text-[10px] text-gray-500 uppercase font-black tracking-[0.1em] mb-4">Equity: <span className="text-blue-500">₹{u.balance || 0}</span></div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                    <span className="text-[9px] text-gray-600 font-mono">NODE ID: {u._id.slice(-8).toUpperCase()}</span>
                    <button onClick={() => copyText(u.email)} className="text-gray-500 hover:text-blue-500 p-1 transition-colors"><Copy size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VERIFICATION MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-[#0b0e11]/95 backdrop-blur-sm flex items-center justify-center z-[100] p-2 md:p-4 overflow-y-auto">
          <div className="bg-[#181a20] border border-gray-800 p-6 md:p-10 rounded-[2.5rem] w-full max-w-2xl max-h-[98vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
            
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#181a20] py-2 z-10">
              <h3 className="text-white font-black uppercase tracking-tighter text-lg md:text-xl flex items-center gap-3 italic">
                <CheckCircle2 className="text-blue-500" size={24} /> Verifying {selected.type} Flow
              </h3>
              <button onClick={() => setSelected(null)} className="bg-[#0b0e11] p-2.5 rounded-full text-gray-500 hover:text-white border border-gray-800 transition"><X size={20}/></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
              <div className="p-5 bg-[#0b0e11] rounded-[1.5rem] border border-gray-800">
                <h4 className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">Merchant Endpoint</h4>
                <div className="bg-[#181a20] p-3.5 rounded-xl border border-gray-800 mb-4 flex items-center justify-between">
                    <code className="text-[11px] text-blue-500 truncate mr-2 font-mono font-bold tracking-tight">{selected.walletAddress}</code>
                    <button onClick={() => copyText(selected.walletAddress)} className="text-white hover:text-blue-500 transition-colors p-1"><Copy size={14} /></button>
                </div>
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest truncate">Identity: <span className="text-gray-300">{selected.user?.email}</span></p>
              </div>

              <div className={`p-5 rounded-[1.5rem] border ${selected.type === 'SELL' ? 'bg-red-500/[0.03] border-red-500/20 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]' : 'bg-blue-600/[0.03] border-blue-500/20 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]'}`}>
                <h4 className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                  {selected.type === 'SELL' ? 'Terminal Payout' : 'Escrow Release'}
                </h4>
                <p className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 tracking-tighter">
                  {selected.type === 'SELL' ? `₹${selected.fiatAmount.toLocaleString()}` : `${selected.cryptoAmount} USDT`}
                </p>
                <div className="h-[1px] bg-gray-800 w-full mb-2"></div>
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Rate Index: <span className="text-gray-400">₹{selected.rate}</span></p>
              </div>
            </div>

            {/* Proof Section */}
            {selected.transactionScreenshot && (
              <div className="mb-8">
                <h4 className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-3 ml-1">Encrypted Receipt Proof</h4>
                <div className="bg-[#0b0e11] rounded-[2rem] border border-gray-800 p-2 overflow-hidden shadow-inner group">
                   <img 
                    src={`https://dubaip2p.onrender.com${selected.transactionScreenshot}`} 
                    alt="Proof" 
                    className="w-full max-h-64 md:max-h-96 object-contain rounded-2xl cursor-zoom-in group-hover:scale-[1.02] transition-transform duration-500"
                    onClick={() => window.open(`https://dubaip2p.onrender.com${selected.transactionScreenshot}`)}
                   />
                </div>
                <p className="text-center text-[9px] text-gray-600 mt-4 font-black uppercase tracking-[0.2em] italic">Click Image to Decrypt Full View</p>
              </div>
            )}

            {/* Verification Terminal */}
            <div className="space-y-4">
              <div className="bg-[#0b0e11] p-1 rounded-2xl border border-gray-800 focus-within:border-blue-500/50 transition-all">
                  <input
                    value={txid}
                    onChange={(e) => setTxid(e.target.value)}
                    placeholder={selected.type === 'SELL' ? "Enter UTR / Bank Batch ID" : "Enter Blockchain TXID Hash"}
                    className="w-full bg-transparent p-4 text-[11px] text-white font-mono outline-none tracking-widest"
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  disabled={actionLoading}
                  onClick={() => releaseAssets(selected._id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] transition-all uppercase tracking-[0.2em] text-[10px]"
                >
                  {actionLoading ? 'Initializing...' : 'Authorize Transaction'}
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => rejectTradeHandler(selected._id)}
                  className="w-full bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white py-4 rounded-2xl font-black border border-red-500/20 transition-all text-[10px] uppercase tracking-[0.2em]"
                >
                  Reject & Lock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}