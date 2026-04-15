import React, { useEffect, useState } from 'react'
import { getReserves } from '../services/exchangeService'

export default function LiveReserveWidget(){
  const [reserves, setReserves] = useState({})

  useEffect(()=>{
    let mounted = true
    const fetchRes = async ()=>{
      try{
        const d = await getReserves()
        if(mounted) setReserves(d.reserves || {})
      }catch(e){ }
    }
    fetchRes()
    const iv = setInterval(fetchRes, 15000)
    return ()=>{ mounted=false; clearInterval(iv) }
  }, [])

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
        Live Reserves
      </div>
      
      {Object.keys(reserves).length === 0 && (
        <div className="text-gray-400 text-xs font-medium py-2">Loading reserve data...</div>
      )}
      
      <div className="space-y-2">
        {Object.entries(reserves).map(([k, v]) => (
          <div key={k} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <div className="text-sm font-medium text-gray-700">{k}</div>
            <div className="text-sm font-mono font-bold text-blue-600">{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}