import React, { useEffect, useState } from 'react'
import { getOperatorStatus } from '../services/exchangeService'

export default function OperatorStatusBadge() {
  const [online, setOnline] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchStatus = async () => {
      try {
        // Change the URL to the public endpoint
        const r = await fetch('https://dubaip2p.onrender.com/api/exchange/operator')
        if (!r.ok) return
        const d = await r.json()
        if (mounted) setOnline(!!d.online)
      } catch (e) {
        console.error("Status check failed:", e)
      }
    }
    
    fetchStatus()
    const iv = setInterval(fetchStatus, 20000)
    return () => { mounted = false; clearInterval(iv) }
  }, [])

  return (
    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
      {/* Visual indicator with pulse effect for 'Online' status */}
      <div className="relative flex h-2 w-2">
        {online && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${online ? 'bg-green-500' : 'bg-red-500'}`}></span>
      </div>
      
      {/* Dynamic text based on operator state */}
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
        Operator: {online ? 'Online' : 'Offline'}
      </span>
    </div>
  )
}