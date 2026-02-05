import React, { useEffect, useState } from 'react'

export default function OperatorStatusBadge(){
  const [online, setOnline] = useState(false)

  useEffect(()=>{
    let mounted = true
    const fetchStatus = async ()=>{
      try{
        const r = await fetch('/api/exchange/admin/operator')
        if (!r.ok) return
        const d = await r.json()
        if(mounted) setOnline(!!d.online)
      }catch(e){}
    }
    fetchStatus()
    const iv = setInterval(fetchStatus, 20000)
    return ()=>{ mounted=false; clearInterval(iv) }
  }, [])

  return (
    <div className={`px-2 py-1 rounded text-xs font-semibold ${online ? 'bg-green-700 text-green-100' : 'bg-zinc-800 text-gray-300'}`}>
      {online ? 'Operator: Online' : 'Operator: Offline'}
    </div>
  )
}
