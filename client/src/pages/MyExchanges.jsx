import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getMyExchanges } from '../services/exchangeService'
import { Eye, Clock, CheckCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react'

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
      case 'PENDING': return <Clock className="text-yellow-500" size={16} />
      case 'PAID': return <Clock className="text-blue-500" size={16} />
      case 'COMPLETED': return <CheckCircle className="text-green-500" size={16} />
      case 'CANCELLED': return <AlertCircle className="text-red-500" size={16} />
      default: return <Clock className="text-gray-500" size={16} />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'text-yellow-500 bg-yellow-900/20 border-yellow-500/30'
      case 'PAID': return 'text-blue-500 bg-blue-900/20 border-blue-500/30'
      case 'COMPLETED': return 'text-green-500 bg-green-900/20 border-green-500/30'
      case 'CANCELLED': return 'text-red-500 bg-red-900/20 border-red-500/30'
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
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white pb-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {/* Header - Stacked on Mobile */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#FCD535] mb-1">My Exchanges</h1>
            <p className="text-sm text-gray-400">Track all your P2P exchange transactions</p>
          </div>
          <button
            onClick={fetchTrades}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all active:scale-95 text-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Status Filter Tabs - Swipable on Mobile */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {[
            { key: 'all', label: 'All', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'paid', label: 'Paid', count: statusCounts.paid },
            { key: 'completed', label: 'Completed', count: statusCounts.completed },
            { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap border ${
                filter === key
                  ? 'bg-[#FCD535] text-black border-[#FCD535]'
                  : 'bg-zinc-800/50 hover:bg-zinc-700 text-gray-300 border-zinc-700'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Trades List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FCD535] mx-auto mb-4"></div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Records...</p>
          </div>
        ) : filteredTrades.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-3xl">
            <div className="text-gray-500 mb-4 px-4">
              <Clock size={48} className="mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-semibold mb-2">No exchanges found</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">
                {filter === 'all' ? 'You haven\'t made any exchanges yet.' : `No ${filter} exchanges found in your history.`}
              </p>
            </div>
            <button
              onClick={() => navigate('/exchange')}
              className="mt-2 px-6 py-3 bg-[#FCD535] text-black font-bold rounded-xl hover:bg-yellow-400 transition-all active:scale-95 text-sm"
            >
              Start New Exchange
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrades.map(trade => (
              <div
                key={trade._id}
                className="bg-[#161A1E] border border-zinc-800 rounded-2xl p-4 md:p-6 hover:border-zinc-600 transition-all cursor-pointer active:bg-zinc-800/50"
                onClick={() => navigate(`/trade/${trade._id}`)}
              >
                <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-[10px] md:text-xs font-mono text-gray-500 bg-black/40 px-2 py-1 rounded">
                      #{trade._id.slice(-8)}
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(trade.status)}`}>
                      {getStatusIcon(trade.status)}
                      {trade.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
                    <Eye size={14} />
                    <span>Details</span>
                  </div>
                </div>

                {/* Grid stacks on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border-l-2 border-red-500/20 pl-3">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">You Send</p>
                    <p className="text-base md:text-lg font-bold text-red-400">₹{trade.fiatAmount.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{trade.sendMethod}</p>
                  </div>
                  <div className="border-l-2 border-green-500/20 pl-3">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">You Receive</p>
                    <p className="text-base md:text-lg font-bold text-green-400">{trade.cryptoAmount} USDT</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{trade.receiveMethod}</p>
                  </div>
                  <div className="border-l-2 border-yellow-500/20 pl-3">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Rate & Date</p>
                    <p className="text-sm font-semibold text-white">1 USDT = ₹{trade.rate.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {new Date(trade.createdAt).toLocaleDateString()} • {new Date(trade.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {trade.status === 'COMPLETED' && trade.txid && (
                  <div className="mt-6 p-3 bg-green-900/10 border border-green-500/20 rounded-xl">
                    <p className="text-[10px] text-green-500 font-bold uppercase mb-1">Transaction Hash:</p>
                    <p className="text-[10px] font-mono text-gray-400 break-all leading-relaxed">{trade.txid}</p>
                  </div>
                )}

                {trade.status === 'CANCELLED' && trade.rejectionReason && (
                  <div className="mt-6 p-3 bg-red-900/10 border border-red-500/20 rounded-xl">
                    <p className="text-[10px] text-red-500 font-bold uppercase mb-1 tracking-tighter">Cancellation Reason:</p>
                    <p className="text-xs text-gray-400 italic">"{trade.rejectionReason}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats - Responsive Grid */}
        {trades.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 text-center">
              <p className="text-xl md:text-2xl font-bold text-[#FCD535]">{statusCounts.completed}</p>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Completed</p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 text-center">
              <p className="text-xl md:text-2xl font-bold text-blue-400">{statusCounts.paid}</p>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Awaiting</p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 text-center">
              <p className="text-xl md:text-2xl font-bold text-yellow-400">{statusCounts.pending}</p>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Pending</p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 text-center">
              <p className="text-xl md:text-2xl font-bold text-red-400">{statusCounts.cancelled}</p>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Cancelled</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}