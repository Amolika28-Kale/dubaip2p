import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getMyExchanges } from '../services/exchangeService'

export default function PaymentHistory(){
  const { token } = useContext(AuthContext)
  const [trades, setTrades] = useState([])

  useEffect(()=>{ fetchHistory() }, [])

  const fetchHistory = async ()=>{
    try{
      const d = await getMyExchanges(token)
      setTrades(d.trades || [])
    }catch(e){console.error(e)}
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <div className="space-y-3">
        {trades.map(t=> (
          <div key={t._id} className="p-3 bg-zinc-900 rounded border border-zinc-700">
            <div className="flex justify-between">
              <div className="font-mono">{t._id.slice(-10)}</div>
              <div className="text-sm">{t.status}</div>
            </div>
            <div className="text-xs text-gray-400">{t.sendMethod} → {t.receiveMethod} • ₹{t.fiatAmount}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
