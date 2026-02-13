import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getMyExchanges } from '../services/exchangeService'
import { Eye, Clock, CheckCircle, AlertCircle, ArrowRight, RefreshCw, Activity, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

export default function MyExchanges(){
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(()=>{ fetchTrades() }, [])

  const fetchTrades = async ()=>{
    setLoading(true)
    try{
      const d = await getMyExchanges(token)
      setTrades(d.trades || [])
    }catch(e){console.error(e)}
    setLoading(false)
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <Clock className="text-blue-500" size={14} />
      case 'PAID': return <Activity className="text-blue-400 animate-pulse" size={14} />
      case 'COMPLETED': return <CheckCircle className="text-green-500" size={14} />
      case 'CANCELLED': return <AlertCircle className="text-red-500" size={14} />
      default: return <Clock className="text-gray-500" size={14} />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
      case 'PAID': return 'text-blue-400 bg-blue-600/10 border-blue-400/20'
      case 'COMPLETED': return 'text-green-500 bg-green-500/10 border-green-500/20'
      case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20'
      default: return 'text-gray-500 bg-gray-900/20 border-gray-500/30'
    }
  }

  const filteredTrades = trades.filter(trade => {
    if (filter === 'all') return true
    return trade.status.toLowerCase() === filter
  })

  const statusCounts = {
    all: trades.length,
    pending: trades.filter(t => t.status === 'PENDING').length,
    paid: trades.filter(t => t.status === 'PAID').length,
    completed: trades.filter(t => t.status === 'COMPLETED').length,
    cancelled: trades.filter(t => t.status === 'CANCELLED').length,
  }

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white pb-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">My Settlements</h1>
            <p className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-[0.2em] mt-1">Institutional Ledger Control</p>
          </div>
          <button
            onClick={fetchTrades}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#181a20] border border-gray-800 text-blue-500 rounded-xl transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest hover:border-blue-500"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Syncing...' : 'Refresh Ledger'}
          </button>
        </div>

        {/* Status Filter Tabs - Scrollable */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {[
            { key: 'all', label: 'All', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'paid', label: 'In Review', count: statusCounts.paid },
            { key: 'completed', label: 'Success', count: statusCounts.completed },
            { key: 'cancelled', label: 'Failed', count: statusCounts.cancelled },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                filter === key
                  ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                  : 'bg-[#181a20] hover:bg-gray-800 text-gray-400 border-gray-800'
              }`}
            >
              {label} <span className="opacity-50 ml-1">[{count}]</span>
            </button>
          ))}
        </div>

        {/* Trades List */}
        {loading ? (
          <div className="text-center py-24 opacity-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Decrypting Data Streams...</p>
          </div>
        ) : filteredTrades.length === 0 ? (
          <div className="text-center py-20 bg-[#181a20] border border-gray-800 rounded-[2.5rem]">
            <Activity size={48} className="mx-auto mb-4 text-gray-800" />
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">No Records Found</h3>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-6">Your transaction history is currently empty</p>
            <button
              onClick={() => navigate('/exchange')}
              className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all active:scale-95 text-xs uppercase tracking-widest"
            >
              Initiate New Trade
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrades.map(trade => (
              <div
                key={trade._id}
                className="bg-[#181a20] border border-gray-800 rounded-[2rem] p-5 md:p-8 hover:border-blue-500/30 transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => navigate(`/trade/${trade._id}`)}
              >
                {/* Decorative Background ID */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-8xl font-black italic pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                   #{trade._id.slice(-4).toUpperCase()}
                </div>

                <div className="flex flex-wrap items-center justify-between mb-8 gap-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="text-[10px] font-mono font-bold text-zinc-500 bg-[#0b0e11] px-3 py-1 rounded-lg border border-gray-800 uppercase tracking-tighter">
                      Index #{trade._id.slice(-8).toUpperCase()}
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-[0.1em] ${getStatusColor(trade.status)}`}>
                      {getStatusIcon(trade.status)}
                      {trade.status === 'PAID' ? 'Reviewing' : trade.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                    <Eye size={14} />
                    <span>View Detail</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                  <div className="border-l-2 border-red-500/20 pl-4">
                    <p className="text-[9px] text-gray-500 uppercase font-black mb-1 tracking-widest">Sent Asset</p>
                    <p className="text-xl font-black text-red-500 tracking-tighter">
                       {trade.type === 'SELL' ? `${trade.cryptoAmount} USDT` : `₹${trade.fiatAmount.toLocaleString()}`}
                    </p>
                    <p className="text-[9px] text-gray-600 font-bold uppercase mt-1 italic opacity-60">{trade.sendMethod}</p>
                  </div>
                  <div className="border-l-2 border-green-500/20 pl-4">
                    <p className="text-[9px] text-gray-500 uppercase font-black mb-1 tracking-widest">Received Asset</p>
                    <p className="text-xl font-black text-green-500 tracking-tighter">
                       {trade.type === 'SELL' ? `₹${trade.fiatAmount.toLocaleString()}` : `${trade.cryptoAmount} USDT`}
                    </p>
                    <p className="text-[9px] text-gray-600 font-bold uppercase mt-1 italic opacity-60">{trade.receiveMethod}</p>
                  </div>
                  <div className="border-l-2 border-blue-500/20 pl-4">
                    <p className="text-[9px] text-gray-500 uppercase font-black mb-1 tracking-widest">Market Rate & Timestamp</p>
                    <p className="text-sm font-black text-white tracking-tight">1 USDT = ₹{trade.rate.toFixed(2)}</p>
                    <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">
                      {new Date(trade.createdAt).toLocaleDateString()} • {new Date(trade.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {trade.status === 'COMPLETED' && trade.txid && (
                  <div className="mt-8 p-4 bg-green-500/[0.02] border border-green-500/10 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-[9px] text-green-500 font-black uppercase mb-1 tracking-widest">Blockchain Hash</p>
                        <p className="text-[10px] font-mono text-gray-500 break-all leading-tight max-w-[250px] md:max-w-md">{trade.txid}</p>
                    </div>
                    <CheckCircle className="text-green-500 opacity-20 shrink-0" size={24} />
                  </div>
                )}

                {trade.status === 'CANCELLED' && trade.rejectionReason && (
                  <div className="mt-8 p-4 bg-red-500/[0.02] border border-red-500/10 rounded-2xl">
                    <p className="text-[9px] text-red-500 font-black uppercase mb-1 tracking-widest">Void Reason</p>
                    <p className="text-xs text-gray-400 italic font-medium">"{trade.rejectionReason}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats - Footer */}
        {trades.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#181a20] border border-gray-800 rounded-2xl p-5 text-center group hover:border-green-500/30 transition-all">
              <p className="text-2xl font-black text-green-500 tracking-tighter">{statusCounts.completed}</p>
              <p className="text-[9px] uppercase font-black text-gray-500 tracking-[0.2em] mt-1">Success</p>
            </div>
            <div className="bg-[#181a20] border border-gray-800 rounded-2xl p-5 text-center group hover:border-blue-500/30 transition-all">
              <p className="text-2xl font-black text-blue-400 tracking-tighter">{statusCounts.paid}</p>
              <p className="text-[9px] uppercase font-black text-gray-500 tracking-[0.2em] mt-1">In Queue</p>
            </div>
            <div className="bg-[#181a20] border border-gray-800 rounded-2xl p-5 text-center group hover:border-blue-500/30 transition-all">
              <p className="text-2xl font-black text-blue-500 tracking-tighter">{statusCounts.pending}</p>
              <p className="text-[9px] uppercase font-black text-gray-500 tracking-[0.2em] mt-1">Awaiting</p>
            </div>
            <div className="bg-[#181a20] border border-gray-800 rounded-2xl p-5 text-center group hover:border-red-500/30 transition-all">
              <p className="text-2xl font-black text-red-500 tracking-tighter">{statusCounts.cancelled}</p>
              <p className="text-[9px] uppercase font-black text-gray-500 tracking-[0.2em] mt-1">Rejected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}