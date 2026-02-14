import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getAdminStats, getLatestExchanges } from '../services/exchangeService'
import { 
  BarChart3, Users, DollarSign, Clock, Shield, ArrowUpRight, 
  ArrowDownLeft, TrendingUp, Activity, Globe, Zap, Database, Search,
  ArrowRight
} from 'lucide-react'

export default function MasterAdmin() {
  const { token, isAdmin } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (isAdmin) loadMasterData() }, [isAdmin])

  const loadMasterData = async () => {
    setLoading(true)
    try {
      const [s, l] = await Promise.all([getAdminStats(token), getLatestExchanges(8)])
      setStats(s)
      setRecent(l.trades || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  if (!isAdmin) return (
    <div className="min-h-screen bg-[#0b0e11] flex items-center justify-center p-6">
      <div className="text-center p-12 bg-[#181a20] border border-red-500/20 rounded-[2.5rem] shadow-2xl">
        <Shield size={60} className="text-red-500 mx-auto mb-6 opacity-50" />
        <h2 className="text-red-500 font-black uppercase tracking-[0.3em] text-xl">Access Denied</h2>
        <p className="text-gray-600 text-[10px] font-bold uppercase mt-2 tracking-widest">Central Intelligence Terminal Locked</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white font-sans p-4 md:p-8 pb-24 selection:bg-blue-500/30">
      
      {/* ================= MASTER HEADER ================= */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 border border-white/10">
            <Database size={30} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Master <span className="text-blue-500">Insights</span></h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Live Intelligence Protocol Active</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={loadMasterData} 
            disabled={loading}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#181a20] border border-gray-800 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-blue-500 transition-all active:scale-95 disabled:opacity-50"
          >
            <Activity size={16} className={`${loading ? 'animate-spin' : ''} text-blue-500`} />
            {loading ? 'Decrypting...' : 'Sync Global Nodes'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ================= PRIMARY STATS (TRANSACTIFY STYLE) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="24h Gross Volume" value={`₹${stats?.dailyVolume?.toLocaleString() || 0}`} icon={<BarChart3 size={20}/>} color="text-blue-500" trend="+12.5%" />
          <StatCard label="Network Nodes" value={stats?.activeUsers || 0} icon={<Users size={20}/>} color="text-blue-400" trend="Active" />
          <StatCard label="Pending Queue" value={stats?.paidCount || 0} icon={<Clock size={20}/>} color="text-red-500" trend="Action Required" />
          <StatCard label="Total Settlements" value={stats?.completedCount || 0} icon={<Globe size={20}/>} color="text-green-500" trend="Processed" />
        </div>

        {/* ================= MAIN ANALYTICS SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* RECENT GLOBAL ACTIVITY TABLE */}
          <div className="lg:col-span-2 bg-[#181a20] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="p-8 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap size={14} className="text-blue-500 fill-blue-500" /> Global Transaction Stream
              </h3>
              <div className="bg-[#0b0e11] px-3 py-1 rounded-lg text-[9px] font-black text-gray-500 border border-gray-800">
                REAL-TIME DATA
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0b0e11] text-[9px] text-gray-600 font-black uppercase tracking-widest border-b border-gray-800">
                  <tr>
                    <th className="px-8 py-4">Flow Type</th>
                    <th className="px-8 py-4">Node Endpoint</th>
                    <th className="px-8 py-4">Asset Value</th>
                    <th className="px-8 py-4 text-right">Terminal State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {recent.map((trade, i) => (
                    <tr key={i} className="hover:bg-blue-600/[0.03] transition-all group">
                      <td className="px-8 py-6">
                        <div className={`flex items-center gap-2 text-[10px] font-black tracking-tighter ${trade.type === 'SELL' ? 'text-red-500' : 'text-green-500'}`}>
                          <div className={`w-2 h-2 rounded-full ${trade.type === 'SELL' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}></div>
                          {trade.type}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-[12px] font-black text-white tracking-widest uppercase">#{trade._id.slice(-6)}</div>
                        <div className="text-[9px] text-gray-600 font-bold uppercase tracking-tight mt-1">{new Date(trade.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-black text-white tracking-tighter italic">₹{trade.fiatAmount?.toLocaleString()}</div>
                        <div className="text-[10px] text-blue-500 font-black uppercase">{trade.cryptoAmount} USDT</div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border tracking-widest uppercase ${
                          trade.status === 'COMPLETED' ? 'border-green-500/20 text-green-500 bg-green-500/10' : 
                          trade.status === 'PAID' ? 'border-blue-500/20 text-blue-500 bg-blue-500/10 animate-pulse' : 
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

          {/* SIDEBAR: VOLUME & CONTROL */}
          <div className="space-y-8">
            <div className="bg-[#181a20] border border-gray-800 rounded-[2.5rem] p-8 shadow-xl">
              <h3 className="text-[10px] font-black text-gray-500 mb-8 uppercase tracking-[0.2em] text-center italic underline underline-offset-8">Liquidity Equilibrium</h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Buy Flow</span>
                    <span className="text-2xl font-black text-blue-500 tracking-tighter">₹{stats?.buyVolume?.toLocaleString() || 0}</span>
                  </div>
                  <div className="w-full bg-[#0b0e11] h-2 rounded-full border border-gray-800 overflow-hidden">
                    <div className="bg-blue-600 h-full shadow-[0_0_15px_rgba(37,99,235,0.6)]" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sell Flow</span>
                    <span className="text-2xl font-black text-red-500 tracking-tighter">₹{stats?.sellVolume?.toLocaleString() || 0}</span>
                  </div>
                  <div className="w-full bg-[#0b0e11] h-2 rounded-full border border-gray-800 overflow-hidden">
                    <div className="bg-red-600 h-full shadow-[0_0_15px_rgba(239,68,68,0.6)]" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-10 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-center">
                <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest leading-relaxed">System Intelligence Balance Protocol: STABLE</p>
              </div>
            </div>

            {/* ACTION CARD */}
            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-center items-center text-center shadow-2xl shadow-blue-600/30 group relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer" onClick={()=>window.location.href='/admin'}>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/20 backdrop-blur-xl">
                <Zap size={32} fill="white" className="text-white" />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-1">Terminal Gate</h3>
              <p className="text-[10px] font-bold text-white/60 mb-8 uppercase tracking-widest italic">Manual Authorization Access</p>
              <div className="w-full py-4 bg-white text-blue-600 font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                Open Terminal <ArrowRight size={14} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color, trend }) {
  return (
    <div className="bg-[#181a20] p-8 rounded-[2.5rem] border border-gray-800 hover:border-blue-500/30 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <div className={`mb-6 ${color} bg-[#0b0e11] w-12 h-12 rounded-2xl flex items-center justify-center border border-gray-800 shadow-inner group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
          <p className="text-2xl font-black text-white tracking-tighter italic">{value}</p>
        </div>
        <div className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg uppercase tracking-widest h-fit">
          {trend}
        </div>
      </div>
    </div>
  )
}