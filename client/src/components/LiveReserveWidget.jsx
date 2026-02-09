import React, { useEffect, useState } from 'react'

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
    <div className="p-3 bg-zinc-900 rounded border border-zinc-700 text-sm">
      <div className="font-bold text-xs text-gray-400 mb-2">Live Reserves</div>
      {Object.keys(reserves).length===0 && <div className="text-gray-500">No data</div>}
      {Object.entries(reserves).map(([k,v])=> (
        <div key={k} className="flex justify-between">
          <div className="text-gray-300">{k}</div>
          <div className="text-[#FCD535] font-mono">{v}</div>
        </div>
      ))}
    </div>
  )
}
