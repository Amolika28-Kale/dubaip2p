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
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center p-12 bg-white border border-red-200 rounded-[2.5rem] shadow-lg">
        <Shield size={60} className="text-red-500 mx-auto mb-6 opacity-50" />
        <h2 className="text-red-500 font-black uppercase tracking-[0.3em] text-xl">Access Denied</h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase mt-2 tracking-widest">Central Intelligence Terminal Locked</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-4 md:p-8 pb-24 selection:bg-blue-100">
      
      {/* ================= MASTER HEADER ================= */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 border border-blue-300">
            <Database size={30} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">Master <span className="text-blue-600">Insights</span></h2>
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
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white border border-gray-200 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-blue-300 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <Activity size={16} className={`${loading ? 'animate-spin' : ''} text-blue-600`} />
            {loading ? 'Decrypting...' : 'Sync Global Nodes'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ================= PRIMARY STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="24h Gross Volume" value={`₹${stats?.dailyVolume?.toLocaleString() || 0}`} icon={<BarChart3 size={20}/>} color="text-blue-600" trend="+12.5%" />
          <StatCard label="Network Nodes" value={stats?.activeUsers || 0} icon={<Users size={20}/>} color="text-blue-500" trend="Active" />
          <StatCard label="Pending Queue" value={stats?.paidCount || 0} icon={<Clock size={20}/>} color="text-red-500" trend="Action Required" />
          <StatCard label="Total Settlements" value={stats?.completedCount || 0} icon={<Globe size={20}/>} color="text-green-600" trend="Processed" />
        </div>

        {/* ================= MAIN ANALYTICS SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* RECENT GLOBAL ACTIVITY TABLE */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-lg relative">
            <div className="p-8 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap size={14} className="text-blue-600 fill-blue-600" /> Global Transaction Stream
              </h3>
              <div className="bg-gray-50 px-3 py-1 rounded-lg text-[9px] font-black text-gray-500 border border-gray-200">
                REAL-TIME DATA
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[9px] text-gray-500 font-black uppercase tracking-widest border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4">Flow Type</th>
                    <th className="px-8 py-4">Node Endpoint</th>
                    <th className="px-8 py-4">Asset Value</th>
                    <th className="px-8 py-4 text-right">Terminal State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recent.map((trade, i) => (
                    <tr key={i} className="hover:bg-blue-50/30 transition-all group">
                      <td className="px-8 py-6">
                        <div className={`flex items-center gap-2 text-[10px] font-black tracking-tighter ${trade.type === 'SELL' ? 'text-red-600' : 'text-green-600'}`}>
                          <div className={`w-2 h-2 rounded-full ${trade.type === 'SELL' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          {trade.type}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-[12px] font-black text-gray-900 tracking-widest uppercase">#{trade._id.slice(-6)}</div>
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mt-1">{new Date(trade.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-black text-gray-900 tracking-tighter italic">₹{trade.fiatAmount?.toLocaleString()}</div>
                        <div className="text-[10px] text-blue-600 font-black uppercase">{trade.cryptoAmount} USDT</div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border tracking-widest uppercase ${
                          trade.status === 'COMPLETED' ? 'border-green-200 text-green-600 bg-green-50' : 
                          trade.status === 'PAID' ? 'border-blue-200 text-blue-600 bg-blue-50 animate-pulse' : 
                          'border-gray-200 text-gray-500 bg-gray-50'
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
            <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-lg">
              <h3 className="text-[10px] font-black text-gray-500 mb-8 uppercase tracking-[0.2em] text-center italic underline underline-offset-8">Liquidity Equilibrium</h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Buy Flow</span>
                    <span className="text-2xl font-black text-blue-600 tracking-tighter">₹{stats?.buyVolume?.toLocaleString() || 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full border border-gray-200 overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Sell Flow</span>
                    <span className="text-2xl font-black text-red-500 tracking-tighter">₹{stats?.sellVolume?.toLocaleString() || 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full border border-gray-200 overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-10 p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest leading-relaxed">System Intelligence Balance Protocol: STABLE</p>
              </div>
            </div>

            {/* ACTION CARD */}
            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-center items-center text-center shadow-lg shadow-blue-200 group relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer" onClick={()=>window.location.href='/admin'}>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/20 backdrop-blur-xl">
                <Zap size={32} fill="white" className="text-white" />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-1">Terminal Gate</h3>
              <p className="text-[10px] font-bold text-white/60 mb-8 uppercase tracking-widest italic">Manual Authorization Access</p>
              <div className="w-full py-4 bg-white text-blue-600 font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
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
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <div className={`mb-6 ${color} bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center border border-gray-200 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
          <p className="text-2xl font-black text-gray-900 tracking-tighter italic">{value}</p>
        </div>
        <div className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-widest h-fit border border-blue-200">
          {trend}
        </div>
      </div>
    </div>
  )
}