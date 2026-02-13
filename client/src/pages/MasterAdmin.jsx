import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getAdminStats, getLatestExchanges } from '../services/exchangeService'
import { BarChart3, Users, DollarSign, Clock, Shield, ArrowUpRight, ArrowDownLeft, TrendingUp, Activity, Globe } from 'lucide-react'

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

  if(!isAdmin) return <div className="p-20 text-red-500 text-center font-black uppercase tracking-widest">Restricted Access - Master Terminal Locked</div>

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#0b0e11] min-h-screen pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <Shield className="text-blue-500" size={28} /> Master Insights
            </h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 ml-1">Central Intelligence Terminal</p>
        </div>
        <button 
          onClick={loadMasterData} 
          disabled={loading}
          className="flex items-center gap-2 text-[10px] bg-[#181a20] border border-gray-800 px-5 py-2.5 rounded-xl text-blue-500 font-black uppercase tracking-widest hover:border-blue-500 transition-all active:scale-95 disabled:opacity-50"
        >
            <Activity size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Decrypting...' : 'Sync Data'}
        </button>
      </div>

      {/* PRIMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="24h Gross Volume" value={`₹${stats?.dailyVolume?.toLocaleString() || 0}`} icon={<BarChart3 size={20}/>} color="text-blue-500" />
        <StatCard label="Network Nodes" value={stats?.activeUsers || 0} icon={<Users size={20}/>} color="text-blue-400" />
        <StatCard label="Pending Queue" value={stats?.paidCount || 0} icon={<Clock size={20}/>} color="text-red-500" />
        <StatCard label="Total Settlements" value={stats?.completedCount || 0} icon={<Globe size={20}/>} color="text-green-500" />
      </div>

      {/* BREAKDOWN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT GLOBAL ACTIVITY TABLE */}
        <div className="lg:col-span-2 bg-[#181a20] border border-gray-800 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
               <Activity size={150} />
            </div>
            <h3 className="text-[11px] font-black text-gray-500 mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div> Live Global Stream
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] text-gray-600 font-black uppercase border-b border-gray-800 pb-2 tracking-widest">
                            <th className="pb-4">Flow</th>
                            <th className="pb-4">Endpoint</th>
                            <th className="pb-4">Asset Value</th>
                            <th className="pb-4 text-right">Node State</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {recent.map((trade, i) => (
                            <tr key={i} className="hover:bg-blue-600/[0.02] transition-colors group">
                                <td className="py-5">
                                    <div className={`flex items-center gap-2 text-[10px] font-black tracking-widest ${trade.type === 'SELL' ? 'text-red-500' : 'text-blue-500'}`}>
                                        {trade.type === 'SELL' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                        {trade.type}
                                    </div>
                                </td>
                                <td className="py-5">
                                    <div className="text-[11px] font-black text-white tracking-widest uppercase">#{trade._id.slice(-6)}</div>
                                    <div className="text-[9px] text-gray-600 font-bold uppercase tracking-tight">{new Date(trade.createdAt).toLocaleTimeString()}</div>
                                </td>
                                <td className="py-5">
                                    <div className="text-sm font-black text-white tracking-tighter">₹{trade.fiatAmount?.toLocaleString()}</div>
                                    <div className="text-[9px] text-gray-500 font-bold uppercase">{trade.cryptoAmount} USDT</div>
                                </td>
                                <td className="py-5 text-right">
                                    <span className={`text-[9px] font-black px-3 py-1 rounded-lg border tracking-widest uppercase ${
                                        trade.status === 'COMPLETED' ? 'border-green-500/20 text-green-500 bg-green-500/[0.03]' : 
                                        trade.status === 'PAID' ? 'border-blue-500/20 text-blue-500 bg-blue-500/[0.03] animate-pulse' : 
                                        'border-gray-800 text-gray-600 bg-[#0b0e11]'
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

        {/* VOLUME SUMMARY & ACTION CARD */}
        <div className="space-y-8">
            <div className="bg-[#181a20] border border-gray-800 rounded-[2rem] p-8 shadow-xl">
                <h3 className="text-[11px] font-black text-gray-500 mb-8 uppercase tracking-[0.2em] text-center">Business Equilibrium</h3>
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Buy Flow</span>
                        <span className="text-xl font-black text-blue-500 tracking-tighter">₹{stats?.buyVolume?.toLocaleString() || 0}</span>
                    </div>
                    <div className="w-full bg-[#0b0e11] h-1.5 rounded-full overflow-hidden border border-gray-800">
                        <div className="bg-blue-600 h-full shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sell Flow</span>
                        <span className="text-xl font-black text-red-500 tracking-tighter">₹{stats?.sellVolume?.toLocaleString() || 0}</span>
                    </div>
                    <div className="w-full bg-[#0b0e11] h-1.5 rounded-full overflow-hidden border border-gray-800">
                        <div className="bg-red-600 h-full shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all duration-1000" style={{ width: '35%' }}></div>
                    </div>
                </div>
                <p className="text-[9px] text-gray-600 text-center mt-8 font-black uppercase tracking-widest italic">Live liquidity rebalancing active</p>
            </div>

            <div className="bg-blue-600 rounded-[2rem] p-8 text-white flex flex-col justify-center items-center text-center shadow-2xl shadow-blue-600/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
                    <Shield size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-1">Verify Queue</h3>
                <p className="text-[10px] font-bold text-white/60 mb-8 uppercase tracking-widest">Awaiting Manual Authorization</p>
                <button 
                    onClick={()=>window.location.href='/admin'} 
                    className="w-full py-4 bg-white text-blue-600 font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:scale-[1.03] transition-all active:scale-95 shadow-xl"
                >
                    Access Terminal
                </button>
            </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-[#181a20] p-7 rounded-[2rem] border border-gray-800 hover:border-blue-500/40 transition-all group">
      <div className={`mb-6 ${color} bg-[#0b0e11] w-12 h-12 rounded-2xl flex items-center justify-center border border-gray-800 shadow-inner group-hover:scale-110 transition-transform`}>{icon}</div>
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
    </div>
  )
}