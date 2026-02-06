import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function MasterAdmin(){
  const { token, isAdmin } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ if(isAdmin) fetchStats() }, [isAdmin])

  const fetchStats = async ()=>{
    setLoading(true)
    try{
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      const d = await res.json()
      setStats(d)
    }catch(e){ console.error(e) }
    setLoading(false)
  }

  if(!isAdmin) return <div className="p-6 text-gray-400">Admin access required</div>

  return (
    <div className="p-6 max-w-5xl">
      <h2 className="text-2xl font-bold mb-4">Master Admin Overview</h2>
      {loading && <div>Loading...</div>}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-zinc-900 rounded border border-zinc-700">
            <div className="text-sm text-gray-400">Active Requests</div>
            <div className="text-2xl font-bold text-[#FCD535]">{stats.activeRequests}</div>
          </div>
          <div className="p-4 bg-zinc-900 rounded border border-zinc-700">
            <div className="text-sm text-gray-400">Daily Volume (₹)</div>
            <div className="text-2xl font-bold text-[#FCD535]">{stats.dailyVolume}</div>
          </div>
          <div className="p-4 bg-zinc-900 rounded border border-zinc-700">
            <div className="text-sm text-gray-400">Active Users (24h)</div>
            <div className="text-2xl font-bold text-[#FCD535]">{stats.activeUsers}</div>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 p-4 rounded border border-zinc-700">
        <h3 className="font-bold mb-2">Quick Actions</h3>
        <div className="flex gap-2">
          <button onClick={()=>window.location.href='/admin'} className="px-4 py-2 bg-[#FCD535] rounded">Open Admin Panel</button>
          <button onClick={fetchStats} className="px-4 py-2 bg-zinc-700 rounded">Refresh</button>
        </div>
      </div>
    </div>
  )
}
