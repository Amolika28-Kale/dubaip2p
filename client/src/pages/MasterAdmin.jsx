import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getAdminStats, getLatestExchanges } from '../services/exchangeService'
import { BarChart3, Users, DollarSign, Clock, Shield } from 'lucide-react'

export default function MasterAdmin(){
  const { token, isAdmin } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ if(isAdmin) loadMasterData() }, [isAdmin])

  const loadMasterData = async () => {
    setLoading(true)
    try {
      const [s, l] = await Promise.all([getAdminStats(token), getLatestExchanges(5)])
      setStats(s)
      setRecent(l.trades || [])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  if(!isAdmin) return <div className="p-6 text-gray-400">Admin access required</div>

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white">MASTER COMMAND CENTER</h2>
        <button onClick={loadMasterData} className="text-xs bg-zinc-800 px-3 py-1 rounded text-yellow-400">Refresh Stats</button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="24h Volume" value={`₹${stats?.dailyVolume || 0}`} icon={<BarChart3 size={20}/>} color="text-green-400" />
        <StatCard label="Active Users" value={stats?.activeUsers || 0} icon={<Users size={20}/>} color="text-blue-400" />
        <StatCard label="Pending Verify" value={stats?.paidCount || 0} icon={<Clock size={20}/>} color="text-yellow-400" />
        <StatCard label="Total Success" value={stats?.completedCount || 0} icon={<DollarSign size={20}/>} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT ACTIVITY LIST */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase">Latest Global Activity</h3>
          <div className="space-y-4">
            {recent.map((trade, i) => (
              <div key={i} className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <div>
                  <div className="text-sm font-bold">Trade #{trade._id.slice(-6)}</div>
                  <div className="text-[10px] text-gray-500">{new Date(trade.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-yellow-400">₹{trade.fiatAmount}</div>
                  <div className={`text-[10px] ${trade.status === 'COMPLETED' ? 'text-green-500' : 'text-zinc-500'}`}>{trade.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="text-yellow-400" size={32} />
          </div>
          <h3 className="font-bold text-white mb-2">Security & Maintenance</h3>
          <p className="text-xs text-gray-500 mb-6">Access controls and global system configurations are currently active.</p>
          <button onClick={()=>window.location.href='/admin'} className="w-full py-3 bg-yellow-400 text-black font-black rounded-lg">
            OPEN ADMIN DASHBOARD
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
      <div className={`mb-3 ${color}`}>{icon}</div>
      <p className="text-gray-500 text-xs font-medium">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  )
}