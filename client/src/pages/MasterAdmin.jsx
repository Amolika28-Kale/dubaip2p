import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getAdminStats, getLatestExchanges } from '../services/exchangeService'
import { BarChart3, Users, DollarSign, Clock, Shield, ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react'

export default function MasterAdmin(){
  const { token, isAdmin } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ if(isAdmin) loadMasterData() }, [isAdmin])

  const loadMasterData = async () => {
    setLoading(true)
    try {
      const [s, l] = await Promise.all([getAdminStats(token), getLatestExchanges(8)])
      setStats(s)
      setRecent(l.trades || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  if(!isAdmin) return <div className="p-6 text-gray-400">Admin access required</div>

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Master Insights</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Global Platform Overview</p>
        </div>
        <button onClick={loadMasterData} className="flex items-center gap-2 text-xs bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-yellow-400 font-bold hover:bg-zinc-800 transition-all">
            <TrendingUp size={14} className={loading ? 'animate-bounce' : ''} />
            {loading ? 'Syncing...' : 'Refresh Data'}
        </button>
      </div>

      {/* PRIMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="24h Total Volume" value={`₹${stats?.dailyVolume?.toLocaleString() || 0}`} icon={<BarChart3 size={20}/>} color="text-green-400" />
        <StatCard label="Active Users" value={stats?.activeUsers || 0} icon={<Users size={20}/>} color="text-blue-400" />
        <StatCard label="Pending Verify" value={stats?.paidCount || 0} icon={<Clock size={20}/>} color="text-yellow-400" />
        <StatCard label="Trades Completed" value={stats?.completedCount || 0} icon={<DollarSign size={20}/>} color="text-purple-400" />
      </div>

      {/* BREAKDOWN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BUY VS SELL BREAKDOWN */}
        <div className="lg:col-span-2 bg-[#161A1E] border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-black text-gray-500 mb-6 uppercase tracking-widest">Recent Global Activity</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] text-zinc-600 font-black uppercase border-b border-zinc-800 pb-2">
                            <th className="pb-3">Type</th>
                            <th className="pb-3">Order ID</th>
                            <th className="pb-3">Amount</th>
                            <th className="pb-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {recent.map((trade, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                <td className="py-4">
                                    <div className={`flex items-center gap-2 text-xs font-bold ${trade.type === 'SELL' ? 'text-red-400' : 'text-green-400'}`}>
                                        {trade.type === 'SELL' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                        {trade.type}
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="text-sm font-bold text-white">#{trade._id.slice(-6)}</div>
                                    <div className="text-[10px] text-gray-500 font-mono">{new Date(trade.createdAt).toLocaleTimeString()}</div>
                                </td>
                                <td className="py-4">
                                    <div className="text-sm font-black text-white">₹{trade.fiatAmount?.toLocaleString()}</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase">{trade.cryptoAmount} USDT</div>
                                </td>
                                <td className="py-4 text-right">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                                        trade.status === 'COMPLETED' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 
                                        trade.status === 'PAID' ? 'border-blue-500/30 text-blue-500 bg-blue-500/5' : 
                                        'border-zinc-800 text-zinc-500 bg-zinc-900'
                                    }`}>
                                        {trade.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* VOLUME SUMMARY */}
        <div className="space-y-6">
            <div className="bg-[#161A1E] border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-xs font-black text-gray-500 mb-6 uppercase tracking-widest text-center">Business Balance</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-xs text-gray-400 font-bold uppercase">Buy Volume</span>
                        <span className="text-lg font-black text-green-400">₹{stats?.buyVolume?.toLocaleString() || 0}</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                        <span className="text-xs text-gray-400 font-bold uppercase">Sell Volume</span>
                        <span className="text-lg font-black text-red-400">₹{stats?.sellVolume?.toLocaleString() || 0}</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full" style={{ width: '35%' }}></div>
                    </div>
                </div>
            </div>

            <div className="bg-[#FCD535] rounded-3xl p-6 text-black flex flex-col justify-center items-center text-center shadow-2xl shadow-yellow-500/10">
                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mb-4">
                    <Shield size={24} />
                </div>
                <h3 className="font-black uppercase tracking-tighter mb-1">Verify Trades</h3>
                <p className="text-[10px] font-bold opacity-60 mb-6 uppercase">Manual processing required</p>
                <button 
                    onClick={()=>window.location.href='/admin'} 
                    className="w-full py-3 bg-black text-[#FCD535] font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95"
                >
                    Open Dashboard
                </button>
            </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-[#161A1E] p-6 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all">
      <div className={`mb-4 ${color} bg-zinc-900 w-10 h-10 rounded-xl flex items-center justify-center`}>{icon}</div>
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
    </div>
  )
}