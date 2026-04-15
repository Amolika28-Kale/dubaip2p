import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getMyExchanges } from '../services/exchangeService'
import { History, ArrowRight, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export default function PaymentHistory() {
  const { token } = useContext(AuthContext)
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchHistory() }, [])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const d = await getMyExchanges(token)
      setTrades(d.trades || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200'
      case 'CANCELLED': return 'text-red-500 bg-red-50 border-red-200'
      case 'PAID': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-20">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-200">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter">Trade History</h2>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Logs of all past settlements</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 opacity-50">
          <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Retrieving Ledger...</p>
        </div>
      ) : trades.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-[2rem] p-12 text-center shadow-sm">
          <History size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trades.map((t) => (
            <div 
              key={t._id} 
              className="bg-white border border-gray-200 p-5 rounded-3xl hover:border-blue-300 hover:shadow-md transition-all group relative overflow-hidden"
            >
              {/* Desktop/Tablet Layout */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex h-10 w-10 rounded-xl bg-gray-50 border border-gray-200 items-center justify-center text-gray-500 group-hover:text-blue-600 transition-colors">
                    {t.type === 'SELL' ? <ArrowRight size={18} className="rotate-[-45deg]" /> : <ArrowRight size={18} className="rotate-[135deg]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-gray-500 font-bold">#{t._id.slice(-8).toUpperCase()}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter ${getStatusStyle(t.status)}`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold uppercase">
                      <span>{t.sendMethod.split('-')[0]}</span>
                      <ArrowRight size={12} className="text-gray-400" />
                      <span>{t.receiveMethod.split('-')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-between items-end gap-1 border-t sm:border-t-0 border-gray-200 pt-3 sm:pt-0">
                  <p className="text-sm md:text-lg font-black text-gray-900 tracking-tighter">
                    ₹{Number(t.fiatAmount).toLocaleString()}
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Mobile Decorative Background Icon */}
              <div className="absolute -right-2 -bottom-2 opacity-[0.03] pointer-events-none">
                <History size={80} className="text-gray-900" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}