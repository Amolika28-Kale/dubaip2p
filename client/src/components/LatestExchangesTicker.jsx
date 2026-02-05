import React, { useEffect, useState } from 'react'

export default function LatestExchangesTicker(){
  const [trades, setTrades] = useState([])

  useEffect(()=>{
    let mounted = true
    const fetchTrades = async ()=>{
      try{
        const r = await fetch('/api/exchange/latest?limit=10')
        const d = await r.json()
        if(mounted) setTrades(d.trades || [])
      }catch(e){}
    }
    fetchTrades()
    const iv = setInterval(fetchTrades, 10000)
    return ()=>{ mounted=false; clearInterval(iv) }
  }, [])

  return (
    <div className="p-3 bg-zinc-900 rounded border border-zinc-700">
      <div className="font-bold text-xs text-gray-400 mb-2">Latest Exchanges</div>
      <div className="space-y-2 text-xs">
        {trades.map(t=> (
          <div key={t._id} className="flex justify-between">
            <div className="font-mono text-xs">{t._id.slice(-6)}</div>
            <div className="text-gray-300">{t.sendMethod}→{t.receiveMethod}</div>
            <div className="text-[#FCD535]">₹{t.fiatAmount}</div>
          </div>
        ))}
        {trades.length===0 && <div className="text-gray-500">No trades</div>}
      </div>
    </div>
  )
}
